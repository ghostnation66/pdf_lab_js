import numpy as np

class LSTM:
    """
    A multi-layered LSTM network implemented using only numpy.
    """
    def __init__(self, input_size, hidden_units_per_layer, output_size):
        """
        Initializes the LSTM network.

        Args:
            input_size (int): The number of features in the input at each time step.
            hidden_units_per_layer (list of int): A list where each element represents
                the number of hidden units (memory cells) in the corresponding LSTM layer.
            output_size (int): The size of the output vector.
        """
        self.input_size = input_size
        self.hidden_units_per_layer = hidden_units_per_layer
        self.num_layers = len(hidden_units_per_layer)
        self.output_size = output_size
        self.params = self._initialize_parameters()

    def _initialize_parameters(self):
        """
        Initializes the weights and biases for all LSTM layers and the output layer.
        """
        params = []
        prev_size = self.input_size
        for i, hidden_size in enumerate(self.hidden_units_per_layer):
            # Input gate
            W_xi = np.random.randn(hidden_size, prev_size) * 0.01
            W_hi = np.random.randn(hidden_size, hidden_size) * 0.01
            b_i = np.zeros((hidden_size, 1))
            # Forget gate
            W_xf = np.random.randn(hidden_size, prev_size) * 0.01
            W_hf = np.random.randn(hidden_size, hidden_size) * 0.01
            b_f = np.zeros((hidden_size, 1))
            # Cell gate
            W_xc = np.random.randn(hidden_size, prev_size) * 0.01
            W_hc = np.random.randn(hidden_size, hidden_size) * 0.01
            b_c = np.zeros((hidden_size, 1))
            # Output gate
            W_xo = np.random.randn(hidden_size, prev_size) * 0.01
            W_ho = np.random.randn(hidden_size, hidden_size) * 0.01
            b_o = np.zeros((hidden_size, 1))

            params.append({
                'W_xi': W_xi, 'W_hi': W_hi, 'b_i': b_i,
                'W_xf': W_xf, 'W_hf': W_hf, 'b_f': b_f,
                'W_xc': W_xc, 'W_hc': W_hc, 'b_c': b_c,
                'W_xo': W_xo, 'W_ho': W_ho, 'b_o': b_o
            })
            prev_size = hidden_size

        # Output layer
        W_y = np.random.randn(self.output_size, prev_size) * 0.01
        b_y = np.zeros((self.output_size, 1))
        params.append({'W_y': W_y, 'b_y': b_y})

        return params

    def _sigmoid(self, x):
        """
        Computes the sigmoid activation function.
        """
        return 1 / (1 + np.exp(-x))

    def _tanh(self, x):
        """
        Computes the hyperbolic tangent activation function.
        """
        return np.tanh(x)

    def forward(self, x_t, prev_hidden_states, prev_cell_states):
        """
        Performs a forward pass for a single time step.

        Args:
            x_t (numpy.ndarray): The input vector at the current time step (input_size, 1).
            prev_hidden_states (list of numpy.ndarray): A list of the hidden state vectors
                from the previous time step for each layer [(hidden_size_l, 1)].
            prev_cell_states (list of numpy.ndarray): A list of the cell state vectors
                from the previous time step for each layer [(hidden_size_l, 1)].

        Returns:
            tuple: A tuple containing the current hidden states for all layers,
                   the current cell states for all layers, and a cache of the
                   intermediate values computed during the forward pass.
        """
        current_hidden_states = []
        current_cell_states = []
        cache = []
        input_t = x_t

        for i in range(self.num_layers):
            params = self.params[i]
            h_prev = prev_hidden_states[i]
            c_prev = prev_cell_states[i]

            # Input gate
            i_t = self._sigmoid(np.dot(params['W_xi'], input_t) + np.dot(params['W_hi'], h_prev) + params['b_i'])
            # Forget gate
            f_t = self._sigmoid(np.dot(params['W_xf'], input_t) + np.dot(params['W_hf'], h_prev) + params['b_f'])
            # Cell gate
            c_tilde_t = self._tanh(np.dot(params['W_xc'], input_t) + np.dot(params['W_hc'], h_prev) + params['b_c'])
            # Current cell state
            c_t = f_t * c_prev + i_t * c_tilde_t
            # Output gate
            o_t = self._sigmoid(np.dot(params['W_xo'], input_t) + np.dot(params['W_ho'], h_prev) + params['b_o'])
            # Current hidden state
            h_t = o_t * self._tanh(c_t)

            current_hidden_states.append(h_t)
            current_cell_states.append(c_t)
            cache.append((x_t, h_prev, c_prev, i_t, f_t, c_tilde_t, c_t, o_t, h_t))
            input_t = h_t  # The hidden state of the current layer becomes the input to the next layer

        # Output layer
        output_params = self.params[-1]
        y_hat_t = np.dot(output_params['W_y'], input_t) + output_params['b_y']
        cache.append(input_t) # Store the input to the output layer

        return current_hidden_states, current_cell_states, cache, y_hat_t

    def backward(self, dy_hat_t, cache, prev_hidden_grads, prev_cell_grads):
        """
        Performs backpropagation for a single time step.

        Args:
            dy_hat_t (numpy.ndarray): The gradient of the loss with respect to the output at the current time step (output_size, 1).
            cache (list): The cache of intermediate values from the forward pass.
            prev_hidden_grads (list of numpy.ndarray): The gradients of the loss with respect
                to the hidden states of the next time step for each layer [(hidden_size_l, 1)].
            prev_cell_grads (list of numpy.ndarray): The gradients of the loss with respect
                to the cell states of the next time step for each layer [(hidden_size_l, 1)].

        Returns:
            tuple: A tuple containing the gradients of the loss with respect to the input
                   at the current time step, the gradients with respect to the previous
                   hidden states for all layers, the gradients with respect to the previous
                   cell states for all layers, and the gradients with respect to the parameters.
        """
        grads = [{} for _ in range(self.num_layers + 1)] # Initialize gradients for all layers + output
        dh_next = list(prev_hidden_grads)
        dc_next = list(prev_cell_grads)

        # Output layer gradients
        output_input_prev = cache[-1]
        grads[-1]['dW_y'] = np.dot(dy_hat_t, output_input_prev.T)
        grads[-1]['db_y'] = dy_hat_t
        dh = np.dot(self.params[-1]['W_y'].T, dy_hat_t)

        # LSTM layer gradients (going backwards)
        for l in reversed(range(self.num_layers)):
            x_t, h_prev, c_prev, i_t, f_t, c_tilde_t, c_t, o_t, h_t = cache[l]
            params = self.params[l]

            dh_next_l = dh_next[l]
            dc_next_l = dc_next[l]

            # Gradient of the cell state
            dc_t = dh_next_l * o_t * (1 - self._tanh(c_t)**2) + dc_next_l

            # Gradient of the output gate
            do_t = dc_t * self._tanh(c_t) * o_t * (1 - o_t)
            dW_xo = np.dot(do_t, x_t.T)
            dW_ho = np.dot(do_t, h_prev.T)
            db_o = do_t

            # Gradient of the cell gate input
            dc_tilde_t = dc_t * i_t * (1 - c_tilde_t**2)
            dW_xc = np.dot(dc_tilde_t, x_t.T)
            dW_hc = np.dot(dc_tilde_t, h_prev.T)
            db_c = dc_tilde_t

            # Gradient of the input gate
            di_t = dc_t * c_tilde_t * i_t * (1 - i_t)
            dW_xi = np.dot(di_t, x_t.T)
            dW_hi = np.dot(di_t, h_prev.T)
            db_i = di_t

            # Gradient of the forget gate
            df_t = dc_t * c_prev * f_t * (1 - f_t)
            dW_xf = np.dot(df_t, x_t.T)
            dW_hf = np.dot(df_t, h_prev.T)
            db_f = df_t

            # Gradient with respect to the previous hidden state
            dh_prev = (np.dot(params['W_hi'].T, di_t) +
                       np.dot(params['W_hf'].T, df_t) +
                       np.dot(params['W_hc'].T, dc_tilde_t) +
                       np.dot(params['W_ho'].T, do_t) +
                       dh) # Add gradient from the layer above if not the top layer
            dh = dh_prev # Propagate gradient to the layer below

            # Gradient with respect to the previous cell state
            dc_prev = dc_t * f_t

            grads[l]['dW_xi'] = dW_xi
            grads[l]['dW_hi'] = dW_hi
            grads[l]['db_i'] = db_i
            grads[l]['dW_xf'] = dW_xf
            grads[l]['dW_hf'] = dW_hf
            grads[l]['db_f'] = db_f
            grads[l]['dW_xc'] = dW_xc
            grads[l]['dW_hc'] = dW_hc
            grads[l]['db_c'] = db_c
            grads[l]['dW_xo'] = dW_xo
            grads[l]['dW_ho'] = dW_ho
            grads[l]['db_o'] = db_o

            dh_next[l] = dh_prev
            dc_next[l] = dc_prev

        # Gradient with respect to the input at the current time step
        dx_t = np.zeros_like(x_t)
        for l in range(self.num_layers):
            params = self.params[l]
            di_t, df_t, dc_tilde_t, do_t = [item[3] for item in cache[l:l+1]][0], \
                                           [item[4] for item in cache[l:l+1]][0], \
                                           [item[5] for item in cache[l:l+1]][0], \
                                           [item[7] for item in cache[l:l+1]][0]
            dx_t += np.dot(params['W_xi'].T, di_t) + \
                    np.dot(params['W_xf'].T, df_t) + \
                    np.dot(params['W_xc'].T, dc_tilde_t) + \
                    np.dot(params['W_xo'].T, do_t)

        return dx_t, dh_next, dc_next, grads

    def train_step(self, X, Y, learning_rate=0.01):
        """
        Performs a single training step (forward and backward pass) over the entire sequence.

        Args:
            X (numpy.ndarray): The input sequence (sequence_length, input_size).
            Y (numpy.ndarray): The target output sequence (sequence_length, output_size).
            learning_rate (float): The learning rate for updating parameters.

        Returns:
            float: The average loss over the sequence.
        """
        sequence_length = X.shape[0]
        input_size = X.shape[1]
        output_size = Y.shape[1]

        # Initialize hidden and cell states for the first time step
        hidden_states = [np.zeros((h, 1)) for h in self.hidden_units_per_layer]
        cell_states = [np.zeros((h, 1)) for h in self.hidden_units_per_layer]

        caches = []
        outputs = np.zeros((sequence_length, output_size))
        loss = 0

        # Forward pass over the entire sequence
        for t in range(sequence_length):
            x_t = X[t].reshape(-1, 1)
            hidden_states, cell_states, cache_t, y_hat_t = self.forward(x_t, hidden_states, cell_states)
            outputs[t, :] = y_hat_t.flatten()
            caches.append(cache_t)
            loss += 0.5 * np.sum((Y[t].reshape(-1, 1) - y_hat_t)**2) # Example squared error loss

        loss /= sequence_length

        # Initialize gradients for backpropagation
        dhidden_next = [np.zeros_like(h) for h in hidden_states]
        dcell_next = [np.zeros_like(c) for c in cell_states]
        total_grads = [{} for _ in range(self.num_layers + 1)]

        # Backward pass over the entire sequence (in reverse)
        for t in reversed(range(sequence_length)):
            dy_hat_t = (outputs[t, :].reshape(-1, 1) - Y[t].reshape(-1, 1))
            dx_t, dhidden_next, dcell_next, grads_t = self.backward(dy_hat_t, caches[t], dhidden_next, dcell_next)

            # Accumulate gradients
            for i in range(self.num_layers + 1):
                for key, value in grads_t[i].items():
                    if key not in total_grads[i]:
                        total_grads[i][key] = np.zeros_like(value)
                    total_grads[i][key] += value

        # Update parameters
        for i in range(self.num_layers):
            for key, value in total_grads[i].items():
                self.params[i][key] -= learning_rate * value / sequence_length # Average gradients

        # Update output layer parameters
        for key, value in total_grads[-1].items():
            self.params[-1][key] -= learning_rate * value / sequence_length

        return loss, outputs

   def predict(self, X):
        """
        Performs a forward pass over the entire sequence to make predictions.

        Args:
            X (numpy.ndarray): The input sequence (sequence_length, input_size).

        Returns:
            numpy.ndarray: The predicted output sequence (sequence_length, output_size).
        """
        sequence_length = X.shape[0]
        hidden_states = [np.zeros((h, 1)) for h in self.hidden_units_per_layer]
        cell_states = [np.zeros((h, 1)) for h in self.hidden_units_per_layer]
        outputs = np.zeros((sequence_length, self.output_size))

        for t in range(sequence_length):
            x_t = X[t].reshape(-1, 1)
            hidden_states, cell_states, _, y_hat_t = self.forward(x_t, hidden_states, cell_states)
            outputs[t, :] =
