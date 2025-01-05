<script>
    import { onMount } from 'svelte';
    import { initScene } from './scenes/scene.js';
  
    let container;
  
    onMount(() => {
      initScene(container);
    });
  </script>
  
  <style>
    :global(body) {
      margin: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
  
    .info-icon {
      position: fixed;
      top: 20px;
      left: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      padding: 5px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      cursor: pointer;
      z-index: 1001;
      transition: background-color 0.3s ease, transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1em;
      width: 30px;
      height: 30px;
      text-align: center;
    }
  
    .info-icon:hover {
      background-color: rgba(0, 0, 0, 0.7);
      transform: scale(1.1);
    }
  
    .hud {
      position: fixed;
      top: 20px;
      left: 70px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 10px;
      max-width: 300px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(5px);
      transition: opacity 0.3s ease, visibility 0.3s ease;
      opacity: 0;
      visibility: hidden;
    }
  
    .info-icon:hover + .hud {
      opacity: 1;
      visibility: visible;
    }
  
    .hud h2 {
      margin-top: 0;
      font-size: 1.2em;
      text-align: center;
    }
  
    .hud ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
  
    .hud li {
      margin: 6px 0;
      font-size: 0.95em;
    }
  
    .hud strong {
      color: #ffd700;
    }
  </style>
  
  <!-- Information Icon -->
  <div class="info-icon">i</div>
  
  <!-- HUD Overlay -->
  <div class="hud">
    <h2>Game Controls</h2>
    <ul>
      <li><strong>W/A/S/D/Q/E:</strong> Movement</li>
      <li><strong>Shift + W:</strong> Speed Boost</li>
      <li><strong>Orbit Controls:</strong> Rotate Camera</li>
      <li><strong>Shift + Click:</strong> Change Focus</li>
      <li><strong>R:</strong> Reset Focus</li>
    </ul>
  </div>
  
  <!-- Three.js Scene Container -->
  <div bind:this={container} style="width: 100%; height: 100vh;"></div>