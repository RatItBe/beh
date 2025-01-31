import { world, BlockPermutation, EquipmentSlot, ItemStack } from "@minecraft/server";
import { ingredientList } from "data/ingredient";

export class CuttingBoard {
    static inputCuttingBoard(eventData) { // 도마 상호작용 시
        const { block, player } = eventData;
        const equippable = player.getComponent("minecraft:equippable");
        const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand); // 손에 든 아이템 확인

        if (mainhand) { // 손에 아이템이 있을 시
            const ingredient = ingredientList.find(i => i.input === mainhand.typeId); // 재료 리스트와 비교 시작
            if (ingredient) { // 손에 든 아이템 = 리스트에 있는 재료일 시
                block.setPermutation(BlockPermutation.resolve(`fs:cutting_board_${ingredient.category}`));
                let ingredientNum = ingredient.number;
                block.setPermutation(block.permutation.withState("fs:ingredient1", Math.floor(ingredientNum / 10)));
                block.setPermutation(block.permutation.withState("fs:ingredient2", ingredientNum % 10));
                if (player.getGameMode() != "creative") {
                    player.runCommandAsync(`clear @s ${mainhand.typeId} 0 1`);
                }
            }
        }
    }

    static cutCuttingBoard(eventData) { // 재료를 올린 도마 상호작용 시
        const { block, player } = eventData;
        const equippable = player.getComponent("minecraft:equippable");
        const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand); // 손에 든 아이템 확인
        if (mainhand && mainhand.typeId === "fs:cleaver") {
            const state = block.permutation.getState("fs:progress");
            if (state - 1 > 0) {
                block.setPermutation(block.permutation.withState("fs:progress", state - 1));
            }
            else {
                const state1 = block.permutation.getState("fs:ingredient1");
                const state2 = block.permutation.getState("fs:ingredient2");
                const ingredientNum = state1 * 10 + state2;
                const blockType = block.typeId;
                const category = blockType.split("_").pop();
                const ingredient = ingredientList.find(i => i.number === ingredientNum && i.category === category);
                if (ingredient) {
                    const output = new ItemStack(ingredient.output, 1)
                    world.getDimension(block.dimension.id).spawnItem(output, block.location);    
                }
                block.setPermutation(BlockPermutation.resolve("fs:cutting_board"));
            }
        }
    }

    static breakCuttingBoard(eventData) { // 재료를 올린 도마 파괴 시
        const { block, destroyedBlockPermutation } = eventData;
        const state1 = destroyedBlockPermutation.getState("fs:ingredient1");
        const state2 = destroyedBlockPermutation.getState("fs:ingredient2");
        const ingredientNum = state1 * 10 + state2;
        const blockType = block.typeId;
        const category = blockType.split("_").pop();
        const ingredient = ingredientList.find(i => i.number === ingredientNum && i.category === category);
        if (ingredient) {
            const input = new ItemStack(ingredient.input, 1)
            world.getDimension(block.dimension.id).spawnItem(input, block.location);
        }
    }
}
