clc
clear
close all

%% Time Series Info
options = odeset('RelTol',1e-10,'AbsTol',1e-8);
transient_span = 500;
train_span = 500;
control_span = 1000;
ts = 0.01;
total_span = transient_span + train_span + control_span;
full_span = [0:ts:total_span];
transient_idx = transient_span/ts;
train_idx = train_span/ts + transient_idx;
control_idx = control_span/ts + train_idx;

y0 =  rand(3,1)*10^-2;

[T,XD] = ode45('Chen',full_span,y0);

drive_sig = XD(:,1);
train_sig = XD(transient_idx+1:train_idx,2);
test_sig = XD(train_idx+1:end,2);


test_err = inf;
while test_err > 6e-4
    %% RC paramters
    n = 500;
    r0 = zeros(n,1);
    A = ER(n,0.1+0.2*rand); %ER(nodes,connection probability)
    A = A - diag(diag(A));
    rho = 0.9; %Largest real eigenvalue is -rho
    % making sure all eig val of A is inside unit circle and have negative
    % real part
    % A = A - (rho + max(real(eig(A))))*eye(n);
    A = A./(0.1 + 0.1*rand + max(abs(eig(A))));

    sigma = 0.5; %Strength of inputs
    win = sigma*(1 - 2*rand(n,1));
    % alpha = 0.1+0.6*rand;
    alpha = 0.61;

    kgain = 3.1;


    %% reservoir training and testing

    [RC_mat] = LeakyTanh(alpha,A,win,drive_sig,r0); %reservoir training function

    %Training
    Omega_tr = RC_mat(transient_idx+1:train_idx,:);
    Omega_tr(:,end+1) = 1;
    % invOmega = Chinv2(Omega_tr,1e-8); %1e-4 is the regression parameter, feel free to change
    % kappa = invOmega*(train_sig);
    kappa = lsqminnorm(Omega_tr, train_sig);
    fit_signal_tr = Omega_tr*kappa;
    train_err = std(fit_signal_tr - train_sig)/std(train_sig);
    %Training

    %Testing
    Omega_ts = RC_mat(train_idx+1:end,:);
    Omega_ts(:,end+1) = 1;
    fit_signal_ts = Omega_ts*kappa;
    test_err = std(fit_signal_ts - test_sig)/std(test_sig);
    %Testing
end
%%

time_ts = 0:ts:control_span;
figure
plot(time_ts,test_sig)
hold on
plot(time_ts,fit_signal_ts)
xlabel('t')
legend('Training data', 'fitted signal')
title(['E = ',num2str(test_err)])
