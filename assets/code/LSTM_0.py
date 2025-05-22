import numpy as np
import matplotlib.pyplot as plt

# Data structure to maintain record of losses over an elapse of epochs during training
loss_container = [[] for _ in range(10)]

x = np.linspace(0, 30, num=1_000).reshape(-1, 1) #1000 samples between 0 and 30 seconds
# Experiment 2 Dyanmics
z = np.sin(6*x).ravel()
y = z + 0.1 * np.random.randn(x.shape[0])
# Experiment 1 Dynamics
z = np.sin(6*x).ravel()+0.1*x.ravel()
# y = np.sin(6*x) + 0.1 * np.random.randn(x.shape[0])
plt.plot(x,y)
plt.ylabel('y (regressor)')
plt.xlabel('x (time)')
plt.show()
y.shape

def sliding_windows(data, window_length,h=1):
    x = []
    y = []
    for i in range(len(data)-window_length-h+1):
        _x = data[i:(i+window_length)]
        _y = data[i+window_length+h-1]
        x.append(_x)
        y.append(_y)
        A=np.shape(x)
    return np.reshape(x,(A[0],A[1],1)), np.reshape(y,(len(y),1))

train_dataset = TensorDataset(trainX, trainY)
test_dataset  = TensorDataset(testX, testY)

class LSTM:
    def __init__(self, input_size, hidden_sizes, output_size, activation="tanh"):
        self.input_size = input_size
        self.hidden_sizes = hidden_sizes
        self.output_size = output_size
        self.num_layers = len(hidden_sizes)
        self.activation = activation.lower()

        self.params = []
        for i in range(self.num_layers):
            in_size = input_size if i == 0 else hidden_sizes[i - 1]
            hidden_size = hidden_sizes[i]
            param = {
                "Wf": np.random.randn(hidden_size, in_size + hidden_size) * 0.1,
                "Wi": np.random.randn(hidden_size, in_size + hidden_size) * 0.1,
                "Wo": np.random.randn(hidden_size, in_size + hidden_size) * 0.1,
                "Wc": np.random.randn(hidden_size, in_size + hidden_size) * 0.1,
                "bf": np.zeros((hidden_size, 1)),
                "bi": np.zeros((hidden_size, 1)),
                "bo": np.zeros((hidden_size, 1)),
                "bc": np.zeros((hidden_size, 1)),
            }
            self.params.append(param)

        self.Wy = np.random.randn(output_size, hidden_sizes[-1]) * 0.1
        self.by = np.zeros((output_size, 1))

    def predict(self, X):
      """
      Predict outputs for a batch of sequences.
      X: numpy array of shape (num_samples, window_length, 1)
      Returns: numpy array of shape (num_samples, 1)
      """
      predictions = []
      for x_seq in X:
          y_pred = self.forward(x_seq)
          try:
              # y_pred = y_pred.item()  # convert 1x1 array to scalar
              predictions.append(y_pred.item())  # convert 1x1 array to scalar
          except:
              predictions.append(y_pred)
              # print("Second Loop", y_pred)
      return np.array(predictions).reshape(-1, 1)

    @staticmethod
    def sigmoid(x):
        return 1 / (1 + np.exp(-x))

    @staticmethod
    def dsigmoid(y):
        return y * (1 - y)

    @staticmethod
    def tanh(x):
        return np.tanh(x)

    @staticmethod
    def dtanh(y):
        return 1 - y ** 2

    @staticmethod
    def relu(x):
        return np.maximum(0, x)

    @staticmethod
    def drelu(x):
        return (x > 0).astype(float)

    def _activation(self, x):
        return self.tanh(x) if self.activation == "tanh" else self.relu(x)

    def _dactivation(self, y):
        return self.dtanh(y) if self.activation == "tanh" else self.drelu(y)

    def forward(self, x_seq):
        self.cache = []
        seq_len = x_seq.shape[0]
        h = [np.zeros((hs, 1)) for hs in self.hidden_sizes]
        c = [np.zeros((hs, 1)) for hs in self.hidden_sizes]
        outputs = []

        for t in range(seq_len):
            x_t = x_seq[t].reshape(-1, 1)
            layer_input = x_t
            h_t, c_t, step_cache = [], [], []

            for l in range(self.num_layers):
                h_prev, c_prev = h[l], c[l]
                param = self.params[l]
                concat = np.vstack((h_prev, layer_input))

                f = self.sigmoid(np.dot(param["Wf"], concat) + param["bf"])
                i = self.sigmoid(np.dot(param["Wi"], concat) + param["bi"])
                o = self.sigmoid(np.dot(param["Wo"], concat) + param["bo"])
                c_hat = self._activation(np.dot(param["Wc"], concat) + param["bc"])

                c_new = f * c_prev + i * c_hat
                h_new = o * self.tanh(c_new)

                step_cache.append((f, i, o, c_hat, c_prev, h_prev, c_new, concat))

                h_t.append(h_new)
                c_t.append(c_new)
                layer_input = h_new

            y_hat = np.dot(self.Wy, h_t[-1]) + self.by
            outputs.append(y_hat)
            h, c = h_t, c_t
            self.cache.append((x_t, h, c, step_cache))

        return outputs[-1]  # only return final output

    def backward(self, dy, learning_rate=0.001):
        dWy = np.zeros_like(self.Wy)
        dby = np.zeros_like(self.by)
        dh_next = [np.zeros((hs, 1)) for hs in self.hidden_sizes]
        dc_next = [np.zeros((hs, 1)) for hs in self.hidden_sizes]
        dparams = [ {key: np.zeros_like(val) for key, val in p.items()} for p in self.params ]

        for t in reversed(range(len(self.cache))):
            x_t, h, c, step_cache = self.cache[t]
            if t == len(self.cache) - 1:
                dWy += np.dot(dy, h[-1].T)
                dby += dy
                dh = np.dot(self.Wy.T, dy)
            else:
                dh = np.zeros_like(dh_next[-1])

            for l in reversed(range(self.num_layers)):
                f, i, o, c_hat, c_prev, h_prev, c_t, concat = step_cache[l]
                dh += dh_next[l]
                dc = dc_next[l] + dh * o * self.dtanh(self.tanh(c_t))

                do = dh * self.tanh(c_t)
                df = dc * c_prev
                di = dc * c_hat
                dc_hat = dc * i

                do_input = do * self.dsigmoid(o)
                df_input = df * self.dsigmoid(f)
                di_input = di * self.dsigmoid(i)
                dc_hat_input = dc_hat * self._dactivation(c_hat)

                dconcat = (
                    np.dot(self.params[l]["Wf"].T, df_input) +
                    np.dot(self.params[l]["Wi"].T, di_input) +
                    np.dot(self.params[l]["Wo"].T, do_input) +
                    np.dot(self.params[l]["Wc"].T, dc_hat_input)
                )

                dparams[l]["Wf"] += np.dot(df_input, concat.T)
                dparams[l]["Wi"] += np.dot(di_input, concat.T)
                dparams[l]["Wo"] += np.dot(do_input, concat.T)
                dparams[l]["Wc"] += np.dot(dc_hat_input, concat.T)
                dparams[l]["bf"] += df_input
                dparams[l]["bi"] += di_input
                dparams[l]["bo"] += do_input
                dparams[l]["bc"] += dc_hat_input

                dh_next[l] = dconcat[:h_prev.shape[0], :]
                dc_next[l] = f * dc

        for l in range(self.num_layers):
            for key in self.params[l]:
                self.params[l][key] -= learning_rate * dparams[l][key]

        self.Wy -= learning_rate * dWy
        self.by -= learning_rate * dby

    def train(self, X, Y, epochs=10, learning_rate=0.001, verbose=True,deposit_value=0):
        """
        X: numpy array (num_samples, window_length, 1)
        Y: numpy array (num_samples, 1)
        """
        for epoch in range(1, epochs + 1):
            total_loss = 0
            for x_seq, y_true in zip(X, Y):
                y_pred = self.forward(x_seq)
                loss = np.mean((y_pred - y_true.reshape(-1, 1)) ** 2)
                total_loss += loss
                self.backward(y_pred - y_true.reshape(-1, 1), learning_rate)

            avg_loss = total_loss / len(X)
            loss_container[deposit_value].append(avg_loss)
            # print("deposited loss")
            if verbose:
                print(f"Epoch {epoch}/{epochs}, Loss: {avg_loss:.6f}")

Ntr=500
batch_size=64
window_length=20
horizon=10

training_data = y[:Ntr]
testing_data = y[Ntr:]

X, Y = sliding_windows(training_data, window_length,horizon)
X1, Y1 = sliding_windows(testing_data, window_length,horizon)
# trainX = Variable(torch.Tensor(np.array(X)))
# trainY = Variable(torch.Tensor(np.array(Y)))
# testX = Variable(torch.Tensor(np.array(X1)))
# testY = Variable(torch.Tensor(np.array(Y1)))

h_val = 3

# Generate sliding window data
X, Y = sliding_windows(y[:500], window_length=12, h=h_val)

# Instantiate and train
model = LSTM(input_size=1, hidden_sizes=[80], output_size=1, activation="relu")
model.train(X, Y, epochs=150, learning_rate=0.005, deposit_value=h_val)
y_pred = model.predict(X1)
y_true = Y1
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 4))
plt.plot(x,y, label='Observed')
plt.plot(x[470:941],y_pred, label='Predicted', linestyle='dashed')
plt.title('LSTM Prediction vs Actual')
plt.xlabel('Sample Index')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.show()

print(loss_container)
