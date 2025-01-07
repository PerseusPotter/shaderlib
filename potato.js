export const supportsShaders = net.minecraft.client.renderer.OpenGlHelper.func_153193_b();
const thing = supportsShaders ? GL20 : Java.type('org.lwjgl.opengl.ARBShaderObjects');

// actual potato pc if you need ARB functions
export const glCreateProgram = supportsShaders ? thing.glCreateProgram : thing.glCreateProgramObjectARB;
export const glGetError = GL11.glGetError;
export const glCreateShader = supportsShaders ? thing.glCreateShader : thing.glCreateShaderObjectARB;
export const glShaderSource = supportsShaders ? thing.glShaderSource : thing.glShaderSourceARB;
export const GL_FRAGMENT_SHADER = supportsShaders ? thing.GL_FRAGMENT_SHADER : thing.GL_SHADER_OBJECT_ARB;
export const GL_VERTEX_SHADER = supportsShaders ? thing.GL_VERTEX_SHADER : thing.GL_SHADER_OBJECT_ARB;
export const glCompileShader = supportsShaders ? thing.glCompileShader : thing.glCompileShaderARB;
export const glGetShaderi = supportsShaders ? thing.glGetShaderi : thing.glGetObjectParameteriARB;
export const GL_COMPILE_STATUS = supportsShaders ? thing.GL_COMPILE_STATUS : thing.GL_OBJECT_COMPILE_STATUS_ARB;
export const glGetShaderInfoLog = supportsShaders ? thing.glGetProgramInfoLog : thing.glGetInfoLogARB;
export const glAttachShader = supportsShaders ? thing.glAttachShader : thing.glAttachObjectARB;
export const glLinkProgram = supportsShaders ? thing.glLinkProgram : thing.glLinkProgramARB;
export const glDeleteShader = supportsShaders ? thing.glDeleteShader : thing.glDeleteObjectARB;
export const glGetProgrami = supportsShaders ? thing.glGetProgrami : thing.glGetObjectParameteriARB;
export const GL_LINK_STATUS = supportsShaders ? thing.GL_LINK_STATUS : thing.GL_OBJECT_LINK_STATUS_ARB;
export const glGetProgramInfoLog = supportsShaders ? thing.glGetProgramInfoLog : thing.glGetInfoLogARB;
export const glValidateProgram = supportsShaders ? thing.glValidateProgram : thing.glValidateProgramARB;
export const GL_VALIDATE_STATUS = supportsShaders ? thing.GL_VALIDATE_STATUS : thing.GL_OBJECT_VALIDATE_STATUS_ARB;
export const glUseProgram = supportsShaders ? thing.glUseProgram : thing.glUseProgramObjectARB;
export const glDeleteProgram = supportsShaders ? thing.glDeleteProgram : thing.glDeleteObjectARB;
export const glGetUniformLocation = supportsShaders ? thing.glGetUniformLocation : thing.glGetUniformLocationARB;
export const glUniform1f = supportsShaders ? thing.glUniform1f : thing.glUniform1fARB;
export const glUniform2f = supportsShaders ? thing.glUniform2f : thing.glUniform2fARB;
export const glUniform3f = supportsShaders ? thing.glUniform3f : thing.glUniform3fARB;
export const glUniform4f = supportsShaders ? thing.glUniform4f : thing.glUniform4fARB;
export const glUniform1i = supportsShaders ? thing.glUniform1i : thing.glUniform1iARB;
export const glUniform2i = supportsShaders ? thing.glUniform2i : thing.glUniform2iARB;
export const glUniform3i = supportsShaders ? thing.glUniform3i : thing.glUniform3iARB;
export const glUniform4i = supportsShaders ? thing.glUniform4i : thing.glUniform4iARB;
export const glUniform1fv = supportsShaders ? thing['glUniform1(int,java.nio.FloatBuffer)'] : thing['glUniform1ARB(int,java.nio.;FloatBuffer)'];
export const glUniform2fv = supportsShaders ? thing['glUniform2(int,java.nio.FloatBuffer)'] : thing['glUniform2ARB(int,java.nio.;FloatBuffer)'];
export const glUniform3fv = supportsShaders ? thing['glUniform3(int,java.nio.FloatBuffer)'] : thing['glUniform3ARB(int,java.nio.;FloatBuffer)'];
export const glUniform4fv = supportsShaders ? thing['glUniform4(int,java.nio.FloatBuffer)'] : thing['glUniform4ARB(int,java.nio.;FloatBuffer)'];
export const glUniform1iv = supportsShaders ? thing['glUniform1(int,java.nio.IntBuffer)'] : thing['glUniform1ARB(int,java.nio.;IntBuffer)'];
export const glUniform2iv = supportsShaders ? thing['glUniform2(int,java.nio.IntBuffer)'] : thing['glUniform2ARB(int,java.nio.;IntBuffer)'];
export const glUniform3iv = supportsShaders ? thing['glUniform3(int,java.nio.IntBuffer)'] : thing['glUniform3ARB(int,java.nio.;IntBuffer)'];
export const glUniform4iv = supportsShaders ? thing['glUniform4(int,java.nio.IntBuffer)'] : thing['glUniform4ARB(int,java.nio.;IntBuffer)'];
export const glUniformMatrix2fv = supportsShaders ? thing.glUniformMatrix2 : thing.glUniformMatrix2ARB;
export const glUniformMatrix3fv = supportsShaders ? thing.glUniformMatrix3 : thing.glUniformMatrix3ARB;
export const glUniformMatrix4fv = supportsShaders ? thing.glUniformMatrix4 : thing.glUniformMatrix4ARB;