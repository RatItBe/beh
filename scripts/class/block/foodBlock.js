import { BlockPermutation } from "@minecraft/server";
import { food } from "data/food";
export class FoodBlockComponent {
    static eat(eventData) {
        const { block, dimension, player } = eventData;
        const foodBlock = food.find((f)=>f.foodID == block.typeId);
        if (!foodBlock) return;
        const state = block.permutation.getState("fs:eating_state");
        if (state - 1 >= 0) {
            block.setPermutation(block.permutation.withState("fs:eating_state", state - 1));
        } else {
            block.setPermutation(BlockPermutation.resolve("minecraft:air"));
        }
        if (foodBlock.effects) {
            for (const effect of foodBlock.effects){
                player.addEffect(effect.id, effect.duration, {
                    amplifier: effect.amplifier,
                    showParticles: effect.showParticles
                });
            }
        }
        if (foodBlock.eatNoise) {
            const sound = foodBlock.eatNoise;
            dimension.playSound(sound.id, block.center(), {
                volume: sound.volume,
                pitch: sound.pitch
            });
        }
        if (foodBlock.onEat) foodBlock.onEat(player);
    }
}
