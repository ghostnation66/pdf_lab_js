import numpy as np
import matplotlib.pyplot as plt
import ipdb
# Parameters
N = 3
T = 300
omega = 1
spectral_multiplier = 0.33

def u(n):
    return np.sin(omega * n)

def spectral_radius(matrix):
    """
    Calculates the spectral radius of a square matrix.
    Args:
        matrix (np.ndarray): A square NumPy array (matrix).

    Returns:
        float: The spectral radius of the matrix.
    """
    # Calculate the eigenvalues of the matrix
    eigenvalues = np.linalg.eigvals(matrix)
    print(eigenvalues)
    # Spectral radius is the maximum absolute value of the eigenvalues
    spectral_radius = np.max(np.abs(eigenvalues))
    return spectral_radius

# Coefficients (customize as needed)
np.random.seed(0)
A = np.random.standard_normal((N, N)) * spectral_multiplier
print(A)
# A = np.ones((N, N)) * spectral_multiplier
# A = np.array([[1,1,1],[3,1,5], [2,2,2]]) * spectral_multiplier
# b = np.random.randn(N) * 2     # b_i vector
b = np.ones((N))

# Initialize container arrays for time series candidates and error term.
x_1 = np.zeros((T+1, N))
x_2 = np.zeros((T+1, N))
error = np.zeros(T+1)
# Designate initial condition for x_1
x_1[0] = np.array([1,5,2])
# Designate the initial condition for x_2
x_2[0] = np.array([13,7,17])

# Iteration over time
for n in range(T):
    x_1[n+1] = (A @ x_1[n] + b * u(n))
    x_2[n+1] = (A @ x_2[n] + b * u(n))
    error[n] = np.linalg.norm(x_1[n]-x_2[n])

# Plot results
plt.figure(figsize=(10, 6))
# for i in range(N):
    # plt.plot(x_1[:, i], label=f'$x_{i}(n)$')
    # plt.ylabel('$x_i(n)$')
# plt.plot(error, label=f'IC:$x_1$ = {x_1[0]} $x_2$ = {x_2[0]}')
plt.plot(x_1[:,0], label="$x_1$")
plt.plot(x_1[:,1], label="$x_2$")
plt.plot(x_1[:,2], label="$x_3$")
# plt.title(f'Evolution of $x_i(n)$, $\\rho(A)$ = {spectral_radius(A)}')
plt.title(f'Evolution of $V_2$, $\\rho(A)$ = {spectral_radius(A)}')
plt.xlabel('n (seconds)')
# plt.ylabel("$||x_1 - x_2||$")
plt.ylabel("$x_i(t)$")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
print(x_1)
# ipdb.set_trace()

# search_pattern_global = "A"
#
# for name, value in globals().items():
#     if search_pattern_global in name:
#         print(f"  Name: {name}, Value: {value}")
# breakpoint()
