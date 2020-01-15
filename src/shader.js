export function vertexShader() {
    return `
    varying vec2 vUv;

    void main()
    {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
    }
  `
}

export function fragmentShader() {
    return `



// Inspired by:
//  http://cmdrkitten.tumblr.com/post/172173936860


#define Pi 3.14159265359

struct Gear
{
    float t;			// Time
    float gearR;		// Gear radius
    float teethH;		// Teeth height
    float teethR;		// Teeth "roundness"
    float teethCount;	// Teeth count
    float diskR;		// Inner or outer border radius
    vec3 color;			// Color
};



float GearFunction(vec2 uv, Gear g)
{
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Gear polar function:
    //  A sine squashed by a logistic function gives a convincing
    //  gear shape!
    float p = g.gearR - 0.5 * g.teethH +
        g.teethH / (1.0 + exp(g.teethR * sin(g.t + g.teethCount * a)));

    float gear = r - p;
    float disk = r - g.diskR;

    return g.gearR > g.diskR ? max(-disk, gear) : max(disk, -gear);
}


float GearDe(vec2 uv, Gear g)
{
    // IQ's f/|Grad(f)| distance estimator:
    float f = GearFunction(uv, g);
    vec2 eps = vec2(0.0001, 0);
    vec2 grad = vec2(
        GearFunction(uv + eps.xy, g) - GearFunction(uv - eps.xy, g),
        GearFunction(uv + eps.yx, g) - GearFunction(uv - eps.yx, g)) / (2.0 * eps.x);

    return (f) / length(grad);
}



float GearShadow(vec2 uv, Gear g)
{
    float r = length(uv + vec2(0.1));
    float de = r - g.diskR + 0.0 * (g.diskR - g.gearR);
    float eps = 0.4 * g.diskR;
    return smoothstep(eps, 0., abs(de));
}


void DrawGear(inout vec3 color, vec2 uv, Gear g, float eps)
{
    float d = smoothstep(eps, -eps, GearDe(uv, g));
    float s = 1.0 - 0.7 * GearShadow(uv, g);
    color = mix(s * color, g.color, d);
}



uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_helmet_texture;
uniform float u_mixRatio;
uniform vec3 iResolution;
uniform float iTime;

varying vec2 vUv;


void main()
{
    float t = 0.5 * iTime;
    vec2 uv = 2.0 * (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    uv = vUv;
    float eps = 2.0 / iResolution.y;

    // Scene parameters;
    vec3 base = vec3(0.95, 0.7, 0.2);
    const float count = 8.0;

    Gear outer = Gear(255.0, 0.8, 0.08, 4.0, 32.0, 0.9, base);
    Gear inner = Gear(0.0, 0.4, 0.08, 4.0, 16.0, 0.3, base);


    // Draw inner gears back to front:
    vec3 color = vec3(0.0);
    for (float i = 0.0; i < count; i++)
    {
        t += 2.0 * Pi / count;
        inner.t = 16.0 * t;
        inner.color = base * (0.35 + 0.6 * i / (count - 1.0));
        DrawGear(color, uv + 0.4 * vec2(cos(t), sin(t)), inner, eps);
    }

    // Draw outer gear:
    DrawGear(color, uv, outer, eps);


    gl_FragColor = vec4(color, 1.0);
}
  `
}
