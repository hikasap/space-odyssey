<script>
    import { onMount } from 'svelte';
    export let scene;
  
    let targetPlanet = null;
    let distanceToTarget = 0;
  
    // Function to compute distance if we have a camera & planet mesh
    function getDistance(planet) {
      if (!scene || !scene._camera || !planet?.mesh) return 0;
      const camPos = scene._camera.position;
      const planetPos = planet.mesh.position;
      return camPos.distanceTo(planetPos) - planet.size;
    }
  
    function updateTargetPlanet(){
        if (scene && scene.getTargetPlanet) {
            targetPlanet = scene.getTargetPlanet();
            distanceToTarget = targetPlanet ? getDistance(targetPlanet) : 0;
          }
    }
    
    onMount(() => {
        const interval = setInterval(updateTargetPlanet, 10);
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
      padding: 8px;
      border-radius: 5px;
      font-size: 0.9rem;
    }
  </style>
  
  {#if targetPlanet}
  <div class="hud-display">
    <p><strong>Planet:</strong> {targetPlanet.name}</p>
    <p><strong>Distance:</strong> {(distanceToTarget * 100).toFixed(0)} km</p>
    <p><strong>Atmosphere:</strong> {targetPlanet.has_atmosphere ? 'Yes' : 'No'}</p>
    <p><strong>Liquid:</strong> {targetPlanet.has_fluid ? 'Yes' : 'No'}</p>
    <p><strong>Orbital Period:</strong> {targetPlanet.orbitalPeriod.toFixed(2)} days</p>
    <p><strong>Orbital Angle:</strong> {targetPlanet.orbitalAngle.toFixed(2)} rad</p>
    <p><strong>Inclination:</strong> {targetPlanet.inclination.toFixed(2)} rad</p>
    <p><strong>Parent Star:</strong> {targetPlanet.parentStar.name}</p>
  </div>
  {/if}