export const food = [
    {
        foodID: "minecraft:cooked_beef",
        onEat: (player)=>{
            player.sendMessage("ate");
        },
        eatNoise: {
            id: "random.burp",
            volume: 1,
            pitch: 0.95
        },
        effects: [
            {
                id: "saturation",
                amplifier: 1,
                duration: 1,
                showParticles: false
            }
        ]
    }
];
