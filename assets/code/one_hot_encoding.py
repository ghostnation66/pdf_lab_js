# The data from MNIST is shipped in this format
y_train = [5, 0, 4, 1, 9, ...]
# We must convert the data to appear as such
y_train = [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],  # for 5
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],  # for 0
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],  # for 4
    [...]
]
