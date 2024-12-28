export function playerDimensionChange(eventData) {
    const player = eventData.player;
    player.setSpawnPoint({dimension: player.dimension,
        x:player.location.x, y:player.location.y, z:player.location.z});
}