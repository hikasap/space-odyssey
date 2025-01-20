<script>
    export let fuelLevel = 1000; // Default fuel level
  </script>
  
  <style>
    .fuel-indicator {
      position: absolute;
      left: 10px;
      bottom: 10px;
      background: rgba(255, 33, 0, 0.7);
      color: #fff;
      padding: 8px;
      border-radius: 5px;
      font-size: 0.9rem;
      user-select: none;
    }
  </style>
  
  <div class="fuel-indicator">
    <p><strong>Fuel Level:</strong> {fuelLevel.toFixed(2)}</p>
  </div>