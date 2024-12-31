export const food = [
    {
        foodID: "fs:bacon_egg",
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
    },
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
                amplifier: 2,
                duration: 1,
                showParticles: false
            }
        ]
    }
];
