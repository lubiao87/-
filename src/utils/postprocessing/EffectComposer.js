/**
 * @author alteredq / http://alteredqualia.com/
 */
// renderer：渲染器对象  WebGLRenderer.js
import * as THREE from "three";
THREE.EffectComposer = function(renderer, renderTarget) {
  this.renderer = renderer;
  // 涮锅参数2没有定义，代码自动定义渲染目标
  if (renderTarget === undefined) {
    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    };

    var size = renderer.getDrawingBufferSize();
    // 借助渲染目标对象    即使没有传输响应参数   也可以直接操作参数   不用重新声明变量
    renderTarget = new THREE.WebGLRenderTarget(
      size.width,
      size.height,
      parameters
    );
    renderTarget.texture.name = "EffectComposer.rt1";
  }
  //把参数renderTarget赋值给renderTarget1，renderTarget可以来自外部，可以来自内部代码生成
  //renderTarget首次渲染之前，是没有关联帧缓冲区的  渲染一次后，会关联一个帧缓冲区
  this.renderTarget1 = renderTarget;
  // 深拷贝渲染目标
  this.renderTarget2 = renderTarget.clone();
  this.renderTarget2.texture.name = "EffectComposer.rt2";

  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;

  this.passes = [];

  // dependencies

  if (THREE.CopyShader === undefined) {
    console.error("THREE.EffectComposer relies on THREE.CopyShader");
  }

  if (THREE.ShaderPass === undefined) {
    console.error("THREE.EffectComposer relies on THREE.ShaderPass");
  }

  this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
};

Object.assign(THREE.EffectComposer.prototype, {
  swapBuffers: function() {
    var tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  },

  addPass: function(pass) {
    this.passes.push(pass);

    var size = this.renderer.getDrawingBufferSize();
    pass.setSize(size.width, size.height);
  },

  insertPass: function(pass, index) {
    this.passes.splice(index, 0, pass);
  },

  render: function(delta) {
    var maskActive = false;

    var pass,
      i,
      il = this.passes.length;

    for (i = 0; i < il; i++) {
      pass = this.passes[i];

      if (pass.enabled === false) continue;

      pass.render(
        this.renderer,
        this.writeBuffer,
        this.readBuffer,
        delta,
        maskActive
      );

      if (pass.needsSwap) {
        if (maskActive) {
          var context = this.renderer.context;

          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

          this.copyPass.render(
            this.renderer,
            this.writeBuffer,
            this.readBuffer,
            delta
          );

          context.stencilFunc(context.EQUAL, 1, 0xffffffff);
        }

        this.swapBuffers();
      }

      if (THREE.MaskPass !== undefined) {
        if (pass instanceof THREE.MaskPass) {
          maskActive = true;
        } else if (pass instanceof THREE.ClearMaskPass) {
          maskActive = false;
        }
      }
    }
  },

  reset: function(renderTarget) {
    if (renderTarget === undefined) {
      var size = this.renderer.getDrawingBufferSize();

      renderTarget = this.renderTarget1.clone();
      renderTarget.setSize(size.width, size.height);
    }

    this.renderTarget1.dispose();
    this.renderTarget2.dispose();
    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
  },

  setSize: function(width, height) {
    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);

    for (var i = 0; i < this.passes.length; i++) {
      this.passes[i].setSize(width, height);
    }
  }
});

THREE.Pass = function() {
  // if set to true, the pass is processed by the composer
  this.enabled = true;

  // if set to true, the pass indicates to swap read and write buffer after rendering
  this.needsSwap = true;

  // if set to true, the pass clears its buffer before rendering
  this.clear = false;

  // if set to true, the result of the pass is rendered to screen
  this.renderToScreen = false;
};

Object.assign(THREE.Pass.prototype, {
  setSize: function(width, height) {},

  render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
});
