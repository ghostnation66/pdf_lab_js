import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import convolve2d
from tensorflow.keras.datasets import mnist

import numpy as np
from tensorflow.keras.datasets import mnist


def load_mnist_twos(normalize=True):
    (x_train, y_train), (x_test, y_test) = mnist.load_data()

       train_mask = y_train == 2
    test_mask = y_test == 2

    x_train = x_train[train_mask]
    y_train = y_train[train_mask]

    x_test = x_test[test_mask]
    y_test = y_test[test_mask]

    if normalize:
        x_train = x_train.astype(np.float32) / 255.0
        x_test = x_test.astype(np.float32) / 255.0

       x_train = x_train.reshape(-1, 1, 28, 28)
    x_test = x_test.reshape(-1, 1, 28, 28)

    return x_train, y_train, x_test, y_test

def plot_feature_map_line_charts(feature_maps, title="Feature Map Values (Line Plot)", max_channels=1):

    C, H, W = feature_maps.shape
    num_plots = min(C, max_channels)

    plt.figure(figsize=(12, 3 * num_plots))

    for i in range(num_plots):
        flattened = feature_maps[i].flatten()
        plt.subplot(num_plots, 1, i + 1)
        plt.plot(flattened, label=f"Feature Map {i}")
        plt.title(f"Feature Map {i}")
        plt.xlabel("Element Index")
        plt.ylabel("Value")
        plt.grid(True)
        plt.tight_layout()

    plt.suptitle(title, fontsize=14)
    plt.show()


def batch_loader(X, y, batch_size=32, shuffle=True):
    indices = np.arange(X.shape[0])
    if shuffle:
        np.random.shuffle(indices)

    for start_idx in range(0, X.shape[0], batch_size):
               end_idx = start_idx + batch_size
        batch_idx = indices[start_idx:end_idx]
        yield X[batch_idx], y[batch_idx]


def load_mnist(normalize=True):
    (x_train, y_train), (x_test, y_test) = mnist.load_data()

    if normalize:
        x_train = x_train.astype(np.float32) / 255.0
        x_test = x_test.astype(np.float32) / 255.0

       x_train = x_train.reshape(-1, 1, 28, 28)
    x_test = x_test.reshape(-1, 1, 28, 28)

    return x_train, y_train, x_test, y_test


def relu(x):
    return np.maximum(0, x)

def relu_derivative(x):
    return (x > 0).astype(float)

def softmax(x):
    e_x = np.exp(x - np.max(x, axis=1, keepdims=True))
    return e_x / np.sum(e_x, axis=1, keepdims=True)

def cross_entropy_loss(pred, target):
    m = pred.shape[0]
    log_likelihood = -np.log(pred[np.arange(m), target] + 1e-9)
    loss = np.sum(log_likelihood) / m
    return loss

def cross_entropy_grad(pred, target):
    m = pred.shape[0]
    grad = pred.copy()
    grad[np.arange(m), target] -= 1
    return grad / m


class Conv2D:
    def __init__(self, in_channels, out_channels, kernel_size=3, stride=1, padding=1, lr=0.01):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size
        self.stride = stride
        self.padding = padding
        self.lr = lr

        limit = np.sqrt(2. / (in_channels * kernel_size * kernel_size))
        self.kernels = np.random.randn(out_channels, in_channels, kernel_size, kernel_size) * limit
        self.biases = np.zeros(out_channels)

    def forward(self, x):
               self.input = x
        self.input_padded = np.pad(
            x,
            ((0, 0), (0, 0), (self.padding, self.padding), (self.padding, self.padding)),
            mode='constant'
        )
        B, C, H, W = self.input.shape
        KH, KW = self.kernel_size, self.kernel_size
        OH = (H + 2 * self.padding - KH) // self.stride + 1
        OW = (W + 2 * self.padding - KW) // self.stride + 1

        out = np.zeros((B, self.out_channels, OH, OW))
        for b in range(B):
            for oc in range(self.out_channels):
                for ic in range(C):
                    out[b, oc] += convolve2d(
                        self.input_padded[b, ic],
                        self.kernels[oc, ic],
                        mode='valid'
                    )
                out[b, oc] += self.biases[oc]

        self.output_before_activation = out
        return np.maximum(0, out)
    def backward(self, grad_output):
               grad_input = np.zeros_like(self.input_padded)
        grad_kernels = np.zeros_like(self.kernels)
        grad_biases = np.zeros_like(self.biases)

               relu_grad = (self.output_before_activation > 0).astype(float)
        grad_output *= relu_grad
        B, C_in, H, W = self.input.shape
        _, C_out, OH, OW = grad_output.shape
        KH, KW = self.kernel_size, self.kernel_size

        for b in range(B):
            for oc in range(C_out):
                for ic in range(C_in):
                    grad_kernels[oc, ic] += convolve2d(
                        self.input_padded[b, ic],
                        grad_output[b, oc],
                        mode='valid'
                    )
                    grad_input[b, ic] += convolve2d(
                        grad_output[b, oc],
                        np.rot90(self.kernels[oc, ic], 2),
                        mode='full'
                    )
                grad_biases[oc] += np.sum(grad_output[b, oc])

               self.kernels -= self.lr * grad_kernels
        self.biases -= self.lr * grad_biases

               if self.padding > 0:
            grad_input = grad_input[:, :, self.padding:-self.padding, self.padding:-self.padding]
        return grad_input



class Flatten:
    def forward(self, x):
        self.input_shape = x.shape
        return x.reshape(x.shape[0], -1)

    def backward(self, grad_output):
        return grad_output.reshape(self.input_shape)


class FullyConnected:
    def __init__(self, in_features, out_features, lr=0.01):
        self.lr = lr
        self.weights = np.random.randn(in_features, out_features) * np.sqrt(2. / in_features)
        self.biases = np.zeros(out_features)

    def forward(self, x):
        self.input = x
        self.output = np.dot(x, self.weights) + self.biases
        return self.output

    def backward(self, grad_output):
        dW = np.dot(self.input.T, grad_output)
        dB = np.sum(grad_output, axis=0)
        d_input = np.dot(grad_output, self.weights.T)

        self.weights -= self.lr * dW
        self.biases -= self.lr * dB
        return d_input



class MNISTCNN:
    def __init__(self, lr=0.01):
        self.conv1 = Conv2D(1, 10, lr=lr)
        self.conv2 = Conv2D(10, 10, lr=lr)
               self.conv3 = Conv2D(10, 128, lr=lr)
        self.flatten = Flatten()
               self.fc = FullyConnected(128 * 10, 10, lr=lr)
        print("MNISTCNN running")

    def forward(self, x):
        self.feature_maps = []
        x = self.conv1.forward(x)
        self.feature_maps.append(x.copy())
        x = self.conv2.forward(x)
        self.feature_maps.append(x.copy())
               x = self.conv3.forward(x)
        self.feature_maps.append(x.copy())

               self.shape_before_pool = x.shape
               x = x[:, :, :, :10]
               x = x.mean(axis=2)

        x = self.flatten.forward(x)        logits = self.fc.forward(x)
        return softmax(logits)

    def backward(self, pred, target):
        grad = cross_entropy_grad(pred, target)        grad = self.fc.backward(grad)
                             grad = self.flatten.backward(grad)


                      B, C_out, Pooled_W = grad.shape

               Original_H, Original_W = self.shape_before_pool[2], self.shape_before_pool[3]
               grad_conv3_output = np.zeros(self.shape_before_pool)
                                           grad_unpooled = np.repeat(grad[:, :, np.newaxis, :], Original_H, axis=2)
                                    grad_conv3_output[:, :, :, :10] = grad_unpooled

               grad = self.conv3.backward(grad_conv3_output)
        grad = self.conv2.backward(grad)
        grad = self.conv1.backward(grad)




import matplotlib.pyplot as plt

def visualize_feature_maps(model, x_input):
    """
    Visualize feature maps after each convolutional layer.
    Assumes x_input shape is (1, 1, 28, 28)
    """
    assert x_input.shape[0] == 1, "Only support batch size = 1 for visualization"

       x = model.conv1.forward(x_input)
    plot_feature_maps(x[0], title="Conv1 Feature Maps")

       x = model.conv2.forward(x)
    plot_feature_maps(x[0], title="Conv2 Feature Maps")

       x = model.conv3.forward(x)
    plot_feature_maps(x[0], title="Conv3 Feature Maps")


def plot_feature_maps(feature_maps, title="Feature Maps"):
    """
    Plots all feature maps from a single layer.
    feature_maps: (C, H, W)
    """
    num_features = feature_maps.shape[0]
    cols = 8
    rows = (num_features + cols - 1) // cols

    plt.figure(figsize=(15, 2 * rows))
    for i in range(num_features):
        plt.subplot(rows, cols, i + 1)
        plt.imshow(feature_maps[i], cmap='viridis')
        plt.axis('off')
        plt.title(f"Map {i}")
    plt.suptitle(title, fontsize=16)
    plt.tight_layout()
    plt.show()


def null_visualize_feature_maps(model, layer_idx, sample_idx=0):
    fmap = model.feature_maps[layer_idx][sample_idx]
    num_maps = fmap.shape[0]
    cols = 10
    rows = int(np.ceil(num_maps / cols))
    fig, axs = plt.subplots(rows, cols, figsize=(cols * 1.5, rows * 1.5))
    for i in range(rows * cols):
        ax = axs[i // cols, i % cols]
        if i < num_maps:
            ax.imshow(fmap[i], cmap='hot')
            ax.axis('off')
        else:
            ax.remove()
    plt.tight_layout()
    plt.show()



X_train, y_train, X_test, y_test = load_mnist()
cnn = MNISTCNN(lr=0.01)


for epoch in range(5):
    print("epoch:", epoch)
    losses = []
    batch_stopper = 0
    for X_batch, y_batch in batch_loader(X_train, y_train, batch_size=16):
        preds = cnn.forward(X_batch)
        loss = cross_entropy_loss(preds, y_batch)
        cnn.backward(preds, y_batch)
        losses.append(loss)
        batch_stopper += 1
        if batch_stopper == 10:
            break

    print(f"Epoch {epoch+1}, Avg Loss: {np.mean(losses):.4f}")



X_train, y_train, _, _ = load_mnist_twos()


sample = X_train[0:1]

visualize_feature_maps(cnn, sample)


x = sample

x = cnn.conv1.forward(x)
plot_feature_map_line_charts(x[0], title="Conv1 Feature Map Values")

x = cnn.conv2.forward(x)
plot_feature_map_line_charts(x[0], title="Conv2 Feature Map Values")

x = cnn.conv3.forward(x)
plot_feature_map_line_charts(x[0], title="Conv3 Feature Map Values")


x = cnn.conv1.forward(sample)
x = cnn.conv2.forward(x)
x = cnn.conv3.forward(x)


x = x[:, :, :, :10]    x = x.mean(axis=2)
for i in range(10):
    feature_vec = x[0, :, i]     plot_final_feature_vector_line_chart(feature_vec, title=f"Feature Vector at Position {i}")
