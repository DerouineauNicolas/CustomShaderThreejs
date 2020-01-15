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
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_helmet_texture;
uniform float u_mixRatio;

varying vec2 vUv;

void main() {
  
    gl_FragColor = vec4(255.0, 0.0, 255.0, 0.0);;
    }
  `
}
