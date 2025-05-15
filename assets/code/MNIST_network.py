import numpy as np
from keras.datasets import mnist
from keras.utils import to_categorical

# --- Layer Base Class ---
class Layer:
    def forward(self, input): raise NotImplementedError
    def backward(self, output_gradient, learning_rate): raise NotImplementedError

# --- Dense Layer ---
class Dense(Layer):
    def __init__(self, input_size, output_size):
        self.weights = np.random.randn(input_size, output_size) * np.sqrt(2. / input_size)
        self.biases = np.zeros((1, output_size))
        self.weight_m = np.zeros_like(self.weights)
        self.weight_v = np.zeros_like(self.weights)
        self.bias_m = np.zeros_like(self.biases)
        self.bias_v = np.zeros_like(self.biases)
        self.t = 1

    def forward(self, input):
        self.input = input
        return np.dot(input, self.weights) + self.biases

    def backward(self, output_gradient, learning_rate, optimizer=None):
        weights_grad = np.dot(self.input.T, output_gradient)
        bias_grad = np.sum(output_gradient, axis=0, keepdims=True)

        if optimizer:
            self.weights, self.weight_m, self.weight_v = optimizer.update(
                self.weights, weights_grad, self.weight_m, self.weight_v, self.t
            )
            self.biases, self.bias_m, self.bias_v = optimizer.update(
                self.biases, bias_grad, self.bias_m, self.bias_v, self.t
            )
            self.t += 1
        else:
            self.weights -= learning_rate * weights_grad
            self.biases -= learning_rate * bias_grad

        return np.dot(output_gradient, self.weights.T)

# --- ReLU Activation ---
class ReLU(Layer):
    def forward(self, input):
        self.input = input
        return np.maximum(0, input)

    def backward(self, output_gradient, learning_rate, optimizer=None):
        return output_gradient * (self.input > 0)

# --- Softmax and Cross-Entropy Combined ---
class SoftmaxCrossEntropy:
    def forward(self, input, target):
        self.input = input
        self.target = target
        exps = np.exp(input - np.max(input, axis=1, keepdims=True))
        self.softmax = exps / np.sum(exps, axis=1, keepdims=True)
        loss = -np.sum(target * np.log(self.softmax + 1e-8)) / input.shape[0]
        return loss

    def backward(self):
        return (self.softmax - self.target) / self.target.shape[0]

# --- Adam Optimizer ---
class AdamOptimizer:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8):
        self.lr, self.beta1, self.beta2, self.epsilon = lr, beta1, beta2, epsilon

    def update(self, param, grad, m, v, t):
        m = self.beta1 * m + (1 - self.beta1) * grad
        v = self.beta2 * v + (1 - self.beta2) * (grad ** 2)
        m_hat = m / (1 - self.beta1 ** t)
        v_hat = v / (1 - self.beta2 ** t)
        param -= self.lr * m_hat / (np.sqrt(v_hat) + self.epsilon)
        return param, m, v

# --- Neural Network Class ---
class NeuralNetwork:
    def __init__(self, use_adam=True, learning_rate=0.01):
        self.layers = []
        self.loss_function = SoftmaxCrossEntropy()
        self.optimizer = AdamOptimizer(lr=learning_rate) if use_adam else None
        self.learning_rate = learning_rate

    def add(self, layer):
        self.layers.append(layer)

    def predict(self, x):
        for layer in self.layers:
            x = layer.forward(x)
        return x

    def train(self, x, y, epochs=10, batch_size=32):
        for epoch in range(epochs):
            permutation = np.random.permutation(x.shape[0])
            x_shuffled = x[permutation]
            y_shuffled = y[permutation]

            for i in range(0, x.shape[0], batch_size):
                x_batch = x_shuffled[i:i+batch_size]
                y_batch = y_shuffled[i:i+batch_size]

                # Forward pass
                output = x_batch
                for layer in self.layers:
                    output = layer.forward(output)

                # Loss
                loss = self.loss_function.forward(output, y_batch)

                # Backward pass
                grad = self.loss_function.backward()
                for layer in reversed(self.layers):
                    grad = layer.backward(grad, self.learning_rate, optimizer=self.optimizer)

            print(f"Epoch {epoch+1}, Loss: {loss:.4f}")



def evaluate_accuracy(nn, x_test, y_test):
    predictions = nn.predict(x_test)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = np.argmax(y_test, axis=1)
    accuracy = np.mean(predicted_classes == true_classes)
    return accuracy

# --- Load MNIST Data ---
def load_mnist_data():
    # Load both training and test data
    (x_train, y_train), (x_test, y_test) = mnist.load_data()

    # Flatten and normalize images
    x_train = x_train.reshape(-1, 28*28) / 255.0
    x_test = x_test.reshape(-1, 28*28) / 255.0

    # One-hot encode the labels
    y_train = to_categorical(y_train, 10)
    y_test = to_categorical(y_test, 10)

    return x_train, y_train, x_test, y_test

# --- Run the Network ---
x_train, y_train, x_test, y_test = load_mnist_data()

nn = NeuralNetwork(use_adam=True, learning_rate=0.001)
nn.add(Dense(784, 128))
nn.add(ReLU())
nn.add(Dense(128, 64))
nn.add(ReLU())
nn.add(Dense(64, 10))

nn.train(x_train, y_train, epochs=10, batch_size=64)

accuracy = evaluate_accuracy(nn, x_test, y_test)
print(f"Test accuracy: {accuracy * 100:.2f}%")
