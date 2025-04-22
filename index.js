import { GL_COMPILE_STATUS, GL_FRAGMENT_SHADER, GL_GEOMETRY_SHADER, GL_LINK_STATUS, GL_VALIDATE_STATUS, GL_VERTEX_SHADER, glAttachShader, glCompileShader, glCreateProgram, glCreateShader, glDeleteProgram, glDeleteShader, glGetError, glGetProgrami, glGetProgramInfoLog, glGetShaderi, glGetShaderInfoLog, glGetUniformLocation, glLinkProgram, glShaderSource, glUniform1f, glUniform1fv, glUniform1i, glUniform1iv, glUniform2f, glUniform2fv, glUniform2i, glUniform2iv, glUniform3f, glUniform3fv, glUniform3i, glUniform3iv, glUniform4f, glUniform4fv, glUniform4i, glUniform4iv, glUniformMatrix2fv, glUniformMatrix3fv, glUniformMatrix4fv, glUseProgram, glValidateProgram } from './potato';

/** @type {Map<number, Shader>} */
const allShaders = new Map();
register('gameUnload', () => {
  // lmao you think i trust rhino???
  // i see that hashtable.getIterator()
  // allShaders.forEach(v => v.dispose());
  Array.from(allShaders.values()).forEach(v => v.dispose());
});

const MAX_ERROR_LOG = 32768;
let mainThread;
Client.scheduleTask(() => mainThread = Thread.currentThread());
const BufferUtils = Java.type('org.lwjgl.BufferUtils');
// sorry
/**
 * @constructor
 * @param {string?} fragSrc
 * @param {string?} vertSrc
 * @param {string?} geomSrc
 */
function InternalShader(fragSrc, vertSrc, geomSrc) {
  if (!(this instanceof InternalShader)) throw new TypeError('Class constructor Shader cannot be invoked without \'new\'');
  if (mainThread !== Thread.currentThread()) {
    print(new Error('Shader: not in main thread, delaying initialization'));
    Client.scheduleTask(2, () => {
      try {
        InternalShader.apply(this, arguments);
      } catch (e) {
        console.error(e);
      }
    });
    return this;
  }

  /** @type {Map<string, number>} */
  this.uniformLocCache = new Map();
  /** @type {number} */
  this.progId = glCreateProgram();
  if (this.progId === 0) throw 'Error while creating program: ' + glGetError();
  allShaders.set(this.progId, this);

  let fragId;
  if (fragSrc) {
    fragId = glCreateShader(GL_FRAGMENT_SHADER);
    if (fragId === 0) throw 'Error while creating fragment shader: ' + glGetError();
    glShaderSource(fragId, fragSrc);
    glCompileShader(fragId);
    if (glGetShaderi(fragId, GL_COMPILE_STATUS) !== 1) throw 'Error compiling fragment shader: ' + glGetShaderInfoLog(fragId, MAX_ERROR_LOG);
  }
  let vertId;
  if (vertSrc) {
    vertId = glCreateShader(GL_VERTEX_SHADER);
    if (vertId === 0) throw 'Error while creating vertex shader: ' + glGetError();
    glShaderSource(vertId, vertSrc);
    glCompileShader(vertId);
    if (glGetShaderi(vertId, GL_COMPILE_STATUS) !== 1) throw 'Error compiling vertex shader: ' + glGetShaderInfoLog(vertId, MAX_ERROR_LOG);
  }
  let geomId;
  if (geomSrc) {
    geomId = glCreateShader(GL_GEOMETRY_SHADER);
    if (geomId === 0) throw 'Error while creating geometry shader: ' + glGetError();
    glShaderSource(geomId, geomSrc);
    glCompileShader(geomId);
    if (glGetShaderi(geomId, GL_COMPILE_STATUS) !== 1) throw 'Error compiling geometry shader: ' + glGetShaderInfoLog(geomId, MAX_ERROR_LOG);
  }

  if (fragId) glAttachShader(this.progId, fragId);
  if (vertId) glAttachShader(this.progId, vertId);
  if (geomId) glAttachShader(this.progId, geomId);

  glLinkProgram(this.progId);
  this.uniformLocCache.clear();
  if (fragId) glDeleteShader(fragId);
  if (vertId) glDeleteShader(vertId);
  if (geomId) glDeleteShader(geomId);

  if (glGetProgrami(this.progId, GL_LINK_STATUS) !== 1) throw 'Error linking program: ' + glGetProgramInfoLog(this.progId, MAX_ERROR_LOG);

  glValidateProgram(this.progId);
  if (glGetProgrami(this.progId, GL_VALIDATE_STATUS) !== 1) throw 'Error validating program: ' + glGetProgramInfoLog(this.progId, MAX_ERROR_LOG);

  (Object.seal || Function.prototype).call(this);
  return this;
}
let loggerEnabled = false;
/**
 * @param {'NOTIFICATION' | 'LOW' | 'MEDIUM' | 'HIGH'} level
 */
InternalShader.enableErrorLogging = function enableErrorLogging(level) {
  if (loggerEnabled) return;
  loggerEnabled = true;
  level = ({
    'HIGH': 3,
    'MEDIUM': 2,
    'LOW': 1,
    'NOTIFICATION': 0
  })[level] ?? (() => { throw 'unknown severity level'; })();
  const sevMap = {
    33387: 0,
    37192: 1,
    37191: 2,
    37190: 3
  };
  Client.scheduleTask(() => {
    GL11.glEnable(GL43.GL_DEBUG_OUTPUT);
    GL43.glDebugMessageCallback(
      new (Java.type('org.lwjgl.opengl.KHRDebugCallback'))(
        new JavaAdapter(Java.type('org.lwjgl.opengl.KHRDebugCallback').Handler, {
          handleMessage(source, type, id, severity, message) {
            if ((sevMap[severity] ?? 0) < level) return;
            console.error(`GL Error: source: ${source}, type: ${type}, id: ${id}, severity: ${severity}, message: ${message}`);
          }
        })
      )
    );
  });
};
InternalShader.prototype.checkProgramId = function checkProgramId() {
  if (this.progId === 0) throw 'No program object found.';
};
InternalShader.prototype.bind = function bind() {
  this.checkProgramId();
  glUseProgram(this.progId);
};
InternalShader.prototype.unbind = function unbind() {
  this.checkProgramId();
  glUseProgram(0);
};
InternalShader.prototype.dispose = function dispose() {
  allShaders.delete(this.progId);
  glDeleteProgram(this.progId);
  this.progId = 0;
  this.uniformLocCache.clear();
  (Object.freeze || Function.prototype).call(this);
};
InternalShader.prototype.delete = InternalShader.prototype.dispose;

/**
 * @param {string} name
 * @returns {number}
 */
InternalShader.prototype.getUniformLocation = function getUniformLocation(name) {
  this.checkProgramId();
  if (typeof name === 'number') return name;
  return this.uniformLocCache.get(name) ?? (
    this.uniformLocCache.set(name, glGetUniformLocation(this.progId, name)),
    this.uniformLocCache.get(name)
  );
};
/**
 * @param {string | number} location
 * @param {number} v0
 */
InternalShader.prototype.uniform1f = function uniform1f(location, v0) {
  glUniform1f(this.getUniformLocation(location), v0);
};
/**
 * @param {string | number} location
 * @param {number} v0
 * @param {number} v1
 */
InternalShader.prototype.uniform2f = function uniform2f(location, v0, v1) {
  glUniform2f(this.getUniformLocation(location), v0, v1);
};
/**
 * @param {string | number} location
 * @param {number} v0
 * @param {number} v1
 * @param {number} v2
 */
InternalShader.prototype.uniform3f = function uniform3f(location, v0, v1, v2) {
  glUniform3f(this.getUniformLocation(location), v0, v1, v2);
};
/**
 * @param {string | number} location
 * @param {number} v0
 * @param {number} v1
 * @param {number} v2
 * @param {number} v3
 */
InternalShader.prototype.uniform4f = function uniform4f(location, v0, v1, v2, v3) {
  glUniform4f(this.getUniformLocation(location), v0, v1, v2, v3);
};
/**
 * @param {string | number} location
 * @param {number} v0
 */
InternalShader.prototype.uniform1i = function uniform1i(location, v0) {
  glUniform1i(this.getUniformLocation(location), v0);
};
/**
 * @param {string | number} location
 * @param {number} v0
 * @param {number} v1
 */
InternalShader.prototype.uniform2i = function uniform2i(location, v0, v1) {
  glUniform2i(this.getUniformLocation(location), v0, v1);
};
/**
 * @param {string | number} location
 * @param {number} v0
 * @param {number} v1
 * @param {number} v2
 */
InternalShader.prototype.uniform3i = function uniform3i(location, v0, v1, v2) {
  glUniform3i(this.getUniformLocation(location), v0, v1, v2);
};
/**
 * @param {string | number} location
 * @param {number} v0
 * @param {number} v1
 * @param {number} v2
 * @param {number} v3
 */
InternalShader.prototype.uniform4i = function uniform4i(location, v0, v1, v2, v3) {
  glUniform4i(this.getUniformLocation(location), v0, v1, v2, v3);
};
function coereceBuffer(input, create) {
  if (Array.isArray(input)) {
    const fb = create(input.length);
    fb.put(input);
    fb.flip();
    return fb;
  }
  return input;
}
const coereceFloatBuffer = input => coereceBuffer(input, BufferUtils.createFloatBuffer);
const coereceIntBuffer = input => coereceBuffer(input, BufferUtils.createIntBuffer);
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.FloatBuffer
 */
InternalShader.prototype.uniform1fv = function uniform1fv(location, values) {
  glUniform1fv(this.getUniformLocation(location), coereceFloatBuffer(values));
};
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.FloatBuffer
 */
InternalShader.prototype.uniform2fv = function uniform2fv(location, values) {
  glUniform2fv(this.getUniformLocation(location), coereceFloatBuffer(values));
};
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.FloatBuffer
 */
InternalShader.prototype.uniform3fv = function uniform3fv(location, values) {
  glUniform3fv(this.getUniformLocation(location), coereceFloatBuffer(values));
};
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.FloatBuffer
 */
InternalShader.prototype.uniform4fv = function uniform4fv(location, values) {
  glUniform4fv(this.getUniformLocation(location), coereceFloatBuffer(values));
};
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.IntBuffer
 */
InternalShader.prototype.uniform1iv = function uniform1iv(location, values) {
  glUniform1iv(this.getUniformLocation(location), coereceIntBuffer(values));
};
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.IntBuffer
 */
InternalShader.prototype.uniform2iv = function uniform2iv(location, values) {
  glUniform2iv(this.getUniformLocation(location), coereceIntBuffer(values));
};
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.IntBuffer
 */
InternalShader.prototype.uniform3iv = function uniform3iv(location, values) {
  glUniform3iv(this.getUniformLocation(location), coereceIntBuffer(values));
};
/**
 * @param {string | number} location
 * @param {number[] | any} values java.nio.IntBuffer
 */
InternalShader.prototype.uniform4iv = function uniform4iv(location, values) {
  glUniform4iv(this.getUniformLocation(location), coereceIntBuffer(values));
};
/**
 * @param {string | number} location
 * @param {boolean} transpose
 * @param {number[] | any} matrices java.nio.FloatBuffer
 */
InternalShader.prototype.uniformMatrix2fv = function uniformMatrix2fv(location, transpose, matrices) {
  glUniformMatrix2fv(this.getUniformLocation(location), transpose, coereceFloatBuffer(matrices));
};
/**
 * @param {string | number} location
 * @param {boolean} transpose
 * @param {number[] | any} matrices java.nio.FloatBuffer
 */
InternalShader.prototype.uniformMatrix3fv = function uniformMatrix3fv(location, transpose, matrices) {
  glUniformMatrix3fv(this.getUniformLocation(location), transpose, coereceFloatBuffer(matrices));
};
/**
 * @param {string | number} location
 * @param {boolean} transpose
 * @param {number[] | any} matrices java.nio.FloatBuffer
 */
InternalShader.prototype.uniformMatrix4fv = function uniformMatrix4fv(location, transpose, matrices) {
  glUniformMatrix4fv(this.getUniformLocation(location), transpose, coereceFloatBuffer(matrices));
};

/** @type {typeof InternalShader & { enableErrorLogging(): void }} */
const Shader = InternalShader;
export default Shader;