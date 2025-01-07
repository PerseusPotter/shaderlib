import Shader from '../index';

const chromaShader = new Shader(
  FileLib.read('shaderlib', 'test/chroma.frag'),
  FileLib.read('shaderlib', 'test/chroma.vert')
);

let totalTicks = 0;
register('tick', t => totalTicks = t);
register('renderOverlay', () => {
  const w = Renderer.screen.getWidth();
  const h = Renderer.screen.getHeight();

  chromaShader.bind();

  // https://github.com/BiscuitDevelopment/SkyblockAddons/blob/main/src/main/java/codes/biscuit/skyblockaddons/shader/chroma/ChromaShader.java
  chromaShader.uniform1f('chromaSize', 30 * Client.getMinecraft().field_71443_c / 100);
  chromaShader.uniform1f('timeOffset', (totalTicks + Tessellator.partialTicks) * (6 / 360));
  chromaShader.uniform1f('saturation', 0.75);

  Renderer.drawRect(
    0xFFFFFFFF,
    w / 4,
    h / 4,
    w / 2,
    h / 2
  );

  chromaShader.unbind();
});