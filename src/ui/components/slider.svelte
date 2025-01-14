<script>
    export let min = 0;
    export let max = 100;
    export let step = 1;
    export let value = (min + max) / 2;
  
    export let trackColor = '#ddd';
    export let thumbColor = '#007bff';
    export let trackHeight = '4px';
    export let thumbSize = '20px';
    export let thumbBorderRadius = '50%';
  
    export let onValueChange = () => {};
    export let onValueCommit = () => {};
  
    let slider;
    let isDragging = false;
  
    function handleMouseDown(event) {
      isDragging = true;
      updateValue(event);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  
    function handleMouseMove(event) {
      if (isDragging) {
        updateValue(event);
        onValueChange(value);
      }
    }
  
    function handleMouseUp() {
      isDragging = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      onValueCommit(value);
    }
  
    function updateValue(event) {
      const rect = slider.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const percentage = offsetX / rect.width;
      const newValue = min + percentage * (max - min);
      value = Math.round(newValue / step) * step;
      value = Math.max(min, Math.min(max, value));
    }
  </script>
  
  <style>
    .slider-container {
      position: relative;
      width: 100%;
      height: 30px;
      margin: 10px 0;
    }
  
    .slider-track {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%);
    }
  
    .slider-thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
  </style>
  
  <div
    class="slider-container"
    bind:this={slider}
    on:mousedown={handleMouseDown}
  >
    <div
      class="slider-track"
      style="background: {trackColor}; height: {trackHeight};"
    ></div>
    <div
      class="slider-thumb"
      style="
        background: {thumbColor};
        width: {thumbSize};
        height: {thumbSize};
        border-radius: {thumbBorderRadius};
        left: {((value - min) / (max - min)) * 100}%;
      "
    ></div>
  </div>