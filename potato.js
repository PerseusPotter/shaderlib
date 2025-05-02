let _canUseShaders = false;
export function canUseShaders() { return _canUseShaders; }
let _canUseFragShader = false;
export function canUseFragShader() { return _canUseFragShader; }
let _canUseVertShader = false;
export function canUseVertShader() { return _canUseVertShader; }
let _canUseGeomShader = false;
export function canUseGeomShader() { return _canUseGeomShader; }
let _useARBShaders = false;
export function useARBShaders() { return _useARBShaders; }
let _useARBGeomShader = false;
export function useARBGeomShader() { return _useARBGeomShader; }
Client.scheduleTask(() => {
  const cap = org.lwjgl.opengl.GLContext.getCapabilities();
  _useARBShaders = !cap.OpenGL21;
  _useARBGeomShader = !cap.OpenGL32;
  _canUseShaders = cap.OpenGL21 || cap.GL_ARB_shader_objects;
  _canUseFragShader = cap.OpenGL21 || cap.GL_ARB_fragment_shader;
  _canUseVertShader = cap.OpenGL21 || cap.GL_ARB_vertex_shader;
  _canUseGeomShader = cap.OpenGL32 || cap.GL_ARB_geometry_shader4;

  if (_useARBShaders) console.log('ShaderLib: using ARB shaders');
  if (_useARBGeomShader) console.log('ShaderLib: using ARB geometry shaders');
  if (!_canUseShaders) console.error('ShaderLib: shaders are not supported');
  else {
    if (!_canUseFragShader) console.error('ShaderLib: fragment shaders are not supported');
    if (!_canUseVertShader) console.error('ShaderLib: vertex shaders are not supported');
    if (!_canUseGeomShader) console.error('ShaderLib: geometry shaders are not supported');
  }
});
const thing = _useARBShaders ? Java.type('org.lwjgl.opengl.ARBShaderObjects') : GL20;

// actual potato pc if you need ARB functions
export const glCreateProgram = _useARBShaders ? thing.glCreateProgramObjectARB : thing.glCreateProgram;
export const glGetError = GL11.glGetError;
export const glCreateShader = _useARBShaders ? thing.glCreateShaderObjectARB : thing.glCreateShader;
export const glShaderSource = _useARBShaders ? thing.glShaderSourceARB : thing.glShaderSource;
export const GL_FRAGMENT_SHADER = _useARBShaders ? Java.type('org.lwjgl.opengl.ARBFragmentShader').GL_FRAGMENT_SHADER_ARB : thing.GL_FRAGMENT_SHADER;
export const GL_VERTEX_SHADER = _useARBShaders ? Java.type('org.lwjgl.opengl.ARBVertexShader').GL_VERTEX_SHADER_ARB : thing.GL_VERTEX_SHADER;
export const GL_GEOMETRY_SHADER = _useARBGeomShader ? Java.type('org.lwjgl.opengl.ARBGeometryShader4').GL_GEOMETRY_SHADER_ARB : GL32.GL_GEOMETRY_SHADER;
export const glCompileShader = _useARBShaders ? thing.glCompileShaderARB : thing.glCompileShader;
export const glGetShaderi = _useARBShaders ? thing.glGetObjectParameteriARB : thing.glGetShaderi;
export const GL_COMPILE_STATUS = _useARBShaders ? thing.GL_OBJECT_COMPILE_STATUS_ARB : thing.GL_COMPILE_STATUS;
export const glGetShaderInfoLog = _useARBShaders ? thing.glGetInfoLogARB : thing.glGetProgramInfoLog;
export const glAttachShader = _useARBShaders ? thing.glAttachObjectARB : thing.glAttachShader;
export const glLinkProgram = _useARBShaders ? thing.glLinkProgramARB : thing.glLinkProgram;
export const glDeleteShader = _useARBShaders ? thing.glDeleteObjectARB : thing.glDeleteShader;
export const glGetProgrami = _useARBShaders ? thing.glGetObjectParameteriARB : thing.glGetProgrami;
export const GL_LINK_STATUS = _useARBShaders ? thing.GL_OBJECT_LINK_STATUS_ARB : thing.GL_LINK_STATUS;
export const glGetProgramInfoLog = _useARBShaders ? thing.glGetInfoLogARB : thing.glGetProgramInfoLog;
export const glValidateProgram = _useARBShaders ? thing.glValidateProgramARB : thing.glValidateProgram;
export const GL_VALIDATE_STATUS = _useARBShaders ? thing.GL_OBJECT_VALIDATE_STATUS_ARB : thing.GL_VALIDATE_STATUS;
export const glUseProgram = _useARBShaders ? thing.glUseProgramObjectARB : thing.glUseProgram;
export const glDeleteProgram = _useARBShaders ? thing.glDeleteObjectARB : thing.glDeleteProgram;
export const glGetUniformLocation = _useARBShaders ? thing.glGetUniformLocationARB : thing.glGetUniformLocation;
export const glUniform1f = _useARBShaders ? thing.glUniform1fARB : thing.glUniform1f;
export const glUniform2f = _useARBShaders ? thing.glUniform2fARB : thing.glUniform2f;
export const glUniform3f = _useARBShaders ? thing.glUniform3fARB : thing.glUniform3f;
export const glUniform4f = _useARBShaders ? thing.glUniform4fARB : thing.glUniform4f;
export const glUniform1i = _useARBShaders ? thing.glUniform1iARB : thing.glUniform1i;
export const glUniform2i = _useARBShaders ? thing.glUniform2iARB : thing.glUniform2i;
export const glUniform3i = _useARBShaders ? thing.glUniform3iARB : thing.glUniform3i;
export const glUniform4i = _useARBShaders ? thing.glUniform4iARB : thing.glUniform4i;
export const glUniform1fv = _useARBShaders ? thing['glUniform1ARB(int,java.nio.FloatBuffer)'] : thing['glUniform1(int,java.nio.FloatBuffer)'];
export const glUniform2fv = _useARBShaders ? thing['glUniform2ARB(int,java.nio.FloatBuffer)'] : thing['glUniform2(int,java.nio.FloatBuffer)'];
export const glUniform3fv = _useARBShaders ? thing['glUniform3ARB(int,java.nio.FloatBuffer)'] : thing['glUniform3(int,java.nio.FloatBuffer)'];
export const glUniform4fv = _useARBShaders ? thing['glUniform4ARB(int,java.nio.FloatBuffer)'] : thing['glUniform4(int,java.nio.FloatBuffer)'];
export const glUniform1iv = _useARBShaders ? thing['glUniform1ARB(int,java.nio.IntBuffer)'] : thing['glUniform1(int,java.nio.IntBuffer)'];
export const glUniform2iv = _useARBShaders ? thing['glUniform2ARB(int,java.nio.IntBuffer)'] : thing['glUniform2(int,java.nio.IntBuffer)'];
export const glUniform3iv = _useARBShaders ? thing['glUniform3ARB(int,java.nio.IntBuffer)'] : thing['glUniform3(int,java.nio.IntBuffer)'];
export const glUniform4iv = _useARBShaders ? thing['glUniform4ARB(int,java.nio.IntBuffer)'] : thing['glUniform4(int,java.nio.IntBuffer)'];
export const glUniformMatrix2fv = _useARBShaders ? thing.glUniformMatrix2ARB : thing.glUniformMatrix2;
export const glUniformMatrix3fv = _useARBShaders ? thing.glUniformMatrix3ARB : thing.glUniformMatrix3;
export const glUniformMatrix4fv = _useARBShaders ? thing.glUniformMatrix4ARB : thing.glUniformMatrix4;