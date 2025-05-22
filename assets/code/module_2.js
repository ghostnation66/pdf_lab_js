function varargout = ray(varargin)
% Program : RAY.m
% Ray summation inside a 2D-PEC parallel plate waveguide

a = input('Plate Height (a) = ? ');
fr = input('Frequency [MHz] = ? ');
k0 = 2*pi*fr/300;
xk = input('Source Height [m] = ? ');
xg = input('Observation Height [m] = ? ');
z = input('Observation Range [m] = ? ');
nray = input('Number of Reflections = ? ');

% solution
g1 = complex(0,0);
g2 = complex(0,0);
g3 = complex(0,0);
g4 = complex(0,0);

% Calculate angles
for n = 1:nray+1
    nr = n-1;
    wn1(n) = fsolve(@myfun1 ,pi/4,[],a,k0,xg,xk,z,nr);
    wn2(n) = fsolve(@myfun2,pi/4,[],a,k0,xg,xk,z,nr);
    wn3(n) = fsolve(@myfun3,pi/4,[],a,k0,xg,xk,z,nr);
    wn4(n) = fsolve(@myfun4,pi/4,[],a,k0,xg,xk,z,nr);

    % Calculate four ray contributions
    g1 = g1 + i/(4*pi)*sqrt((2*pi*i)/(k0*abs(q1d2(wn1(n),a,k0,xg,xk,z,nr))))*exp(i*k0*q1(wn1(n),a,k0,xg,xk,z,nr));
    g2 = g2 + i/(4*pi)*sqrt((2*pi*i)/(k0*abs(q2d2(wn2(n),a,k0,xg,xk,z,nr))))*exp(i*k0*q2(wn2(n),a,k0,xg,xk,z,nr));
    g3 = g3 + i/(4*pi)*sqrt((2*pi*i)/(k0*abs(q3d2(wn3(n),a,k0,xg,xk,z,nr))))*exp(i*k0*q3(wn3(n),a,k0,xg,xk,z,nr));
    g4 = g4 + i/(4*pi)*sqrt((2*pi*i)/(k0*abs(q4d2(wn4(n),a,k0,xg,xk,z,nr))))*exp(i*k0*q4(wn4(n),a,k0,xg,xk,z,nr));
end

green = g1 + g2 + g3 + g4;

% --- Functions for ray equations ---

function F = myfun1(wn1,a,k,xg,xl,z,n)
    F = -(xg-xl)*sin(wn1)+z*cos(wn1)-2*a*n*sin(wn1);

function F = myfun2(wn2,a,k,xg,xl,z,n)
    F = -(xg+xl)*sin(wn2)+z*cos(wn2)-2*a*n*sin(wn2);

function F = myfun3(wn3,a,k,xg,xl,z,n)
    F = (xg+xl)*sin(wn3)+z*cos(wn3)-2*a*(n+1)*sin(wn3);

function F = myfun4(wn4,a,k,xg,xl,z,n)
    F = -(xl-xg)*sin(wn4)+z*cos(wn4)-2*a*(n+1)*sin(wn4);

function q1 = q1(wn1,a,k,xg,xl,z,n)
    q1 = (xg-xl)*cos(wn1)+z*sin(wn1)+2*a*n*cos(wn1);

function q1d2 = q1d2(wn1,a,k,xg,xl,z,n)
    q1d2 = -(xg-xl)*cos(wn1)-z*sin(wn1)-2*a*n*cos(wn1);

function q2 = q2(wn2,a,k,xg,xl,z,n)
    q2 = (xg+xl)*cos(wn2)+z*sin(wn2)+2*a*n*cos(wn2);

function q2d2 = q2d2(wn2,a,k,xg,xl,z,n)
    q2d2 = -(xg+xl)*cos(wn2)-z*sin(wn2)-2*a*n*cos(wn2);

function q3 = q3(wn3,a,k,xg,xl,z,n)
    q3 = -(xg+xl)*cos(wn3)+z*sin(wn3)+2*a*(n+1)*cos(wn3);

function q3d2 = q3d2(wn3,a,k,xg,xl,z,n)
    q3d2 = (xg+xl)*cos(wn3)-z*sin(wn3)-2*a*(n+1)*cos(wn3);

function q4 = q4(wn4,a,k,xg,xl,z,n)
    q4 = (xl-xg)*cos(wn4)+z*sin(wn4)+2*a*(n+1)*cos(wn4);

function q4d2 = q4d2(wn4,a,k,xg,xl,z,n)
    q4d2 = -(xl-xg)*cos(wn4)-z*sin(wn4)-2*a*(n+1)*cos(wn4);

% --- End of Ray.m ---
end
