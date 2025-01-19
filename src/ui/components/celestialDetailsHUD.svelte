<script>
    import { onMount } from 'svelte';
    export let scene;
  
    let targetCelestial = null;
    let distanceToTarget = 0;
  
    // Function to compute distance if we have a camera & celestial mesh
    function getDistance(celestial) {
      if (!scene || !scene._camera || !celestial?.mesh) return 0;
      const camPos = scene._camera.position;
      const celestialPos = celestial.mesh.position;
      return camPos.distanceTo(celestialPos) - celestial.size;
    }
  
    function updateTargetCelestial(){
        if (scene && scene.getTargetCelestial) {
            targetCelestial = scene.getTargetCelestial();
            distanceToTarget = targetCelestial ? getDistance(targetCelestial) : 0;
          }
    }
    
    onMount(() => {
        const interval = setInterval(updateTargetCelestial, 10);
        return () => clearInterval(interval);
    });
  </script>
  
  <style>
    .hud-display {
      position: absolute;
      right: 10px;
      bottom: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 6px;
      border-radius: 5px;
      font-size: 0.8rem;
      user-select: none;
    }
  </style>
  
  {#if targetCelestial}
  <div class="hud-display">
    <p><strong>Distance:</strong> {(distanceToTarget * 100).toFixed(0)} km</p>
    {#each Object.entries(targetCelestial.celestialDetails) as [key, value]}
    {#if key.includes('Color')}
    <p><strong>{key}:</strong> 
      <span style="display: inline-block; width: 1em; height: 1em; background-color: {"#"+value};"></span>
    </p>
    {:else}
    <p><strong>{key}:</strong> {typeof value === 'number' ? value.toFixed(2) : value}</p>
    {/if}
    {/each}
  </div>
  {/if}