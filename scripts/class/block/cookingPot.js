import { world, ItemStack, BlockPermutation, EquipmentSlot } from "@minecraft/server";
import { potRecipe2, potRecipe3, potRecipe4 } from 'data/potRecipe';
import { cookingPotIngredient } from "data/ingredient";
import { food } from "data/food";

export class CookingPot {
    constructor(eventData) {
        this.player = eventData.player;
        this.block = eventData.block;
        this.dimension = this.block.dimension.id;
        this.x = this.block.x;
        this.y = this.block.y;
        this.z = this.block.z;
    }

    interactCookingPot() { // 솥 상호작용 시
        if (this.block.below(1).matches("minecraft:campfire", {"extinguished":false}) === false) return; // 1칸 아래 불 붙은 모닥불이 없을 시 즉시 종료

        const equippable = this.player.getComponent("minecraft:equippable"); // 플레이어 손 데이터 불러옴
        const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (mainhand) { // 손에 아이템이 있을 시
            const state = this.block.permutation.getState("fs:cooking_state"); // 솥 조리state 불러옴

            if (mainhand.typeId === "fs:ladle") { // 손에 든 게 국자일 시
                let potString = world.getDynamicProperty("cookingPot") || ""; // 솥 데이터 로드
                let pot = potString.split(',');

                for (let i = 1; i <= pot.length; i += 8) { // 솥 데이터 탐색 시작
                    const dimension = pot[i];
                    const x = pot[i+1]; const y = pot[i+2]; const z = pot[i+3];
                    if (x == this.x && y == this.y && z == this.z && dimension == this.dimension) { // 일치하는 좌표가 있을 시
                        let successCooking = false; // 요리 성공 여부를 저장할 변수 생성
                        if (state > 1) { // 재료가 2개 이상 들어갔을 시
                            let completePotString = world.getDynamicProperty("completePot") || ""; // 완성솥 데이터 로드
                            let completePot = completePotString.split(',');
                            const potRecipes = {
                                2: potRecipe2,
                                3: potRecipe3,
                                4: potRecipe4,
                            };
                            for (const list of potRecipes[state]) { // 투입된 재료와 일치하는 레시피가 있는지 비교 시작
                                let match = true; // 레시피 일치 여부를 저장할 변수 생성
                                for (let j = 1; j <= state; j++) { // 투입된 재료 개수만큼 비교
                                    if (list[`ingredient${j}`] !== pot[i+3 + j]) { // 재료와 레시피 불일치 시
                                        match = false; // 즉시 종료
                                        break;
                                    }
                                }
                                if (match) { // 모든 재료와 레시피 일치 시
                                    completePot.push(this.dimension, this.x, this.y, this.z, list.recipeName, this.block.typeId); // 완성솥 데이터에 추가
                                    this.block.dimension.playSound("mob.husk.convert_to_zombie", this.block.center(), {
                                        volume: 1,
                                        pitch: 0.8
                                    });
                                    successCooking = true; // 성공한 요리로 판별
                                    break;
                                }
                            }
                            if (!successCooking) { // 모든 레시피와 비교했음에도 불일치 시(실패한 요리)
                                completePot.push(this.dimension, this.x, this.y, this.z, "fs:failed_food", this.block.typeId); // 완성솥 데이터에 실패한 요리로 추가
                                this.block.dimension.playSound("mob.squid.hurt", this.block.center(), {
                                    volume: 1,
                                    pitch: 0.9
                                });
                            }
                            pot.splice(i, 8); // 솥 데이터 삭제 후 갱신
                            const updatedPotString = pot.join(',');
                            world.setDynamicProperty("cookingPot", updatedPotString);
                            const updatedCompletePotString = completePot.join(','); // 요리 데이터 추가 후 갱신
                            world.setDynamicProperty("completePot", updatedCompletePotString);
                            this.block.setPermutation(BlockPermutation.resolve("fs:finished_dish")); // 완성솥 블록으로 변환
                            if (Math.random() < 0.5) this.block.below(1).setPermutation(BlockPermutation.resolve("minecraft:campfire", {"extinguished":true}));
                            return;
                        }
                    }
                }
            }
            else if (mainhand.hasTag("minecraft:is_food") || cookingPotIngredient.includes(mainhand.typeId)) { // 손에 든 게 식재료일 시
                let potString = world.getDynamicProperty("cookingPot") || ""; // 솥 데이터 로드
                let pot = potString.split(','); // 데이터의 형태를 문자열에서 배열로 변환
        
                let existingPot = false; // 존재하던 솥인지 판별할 플래그
        
                for (let i = 1; i <= pot.length; i += 8) { // 솥 데이터 탐색 시작
                    const dimension = pot[i];
                    const x = pot[i+1]; const y = pot[i+2]; const z = pot[i+3];
                    if (x == this.x && y == this.y && z == this.z && dimension == this.dimension) { // 일치하는 좌표가 있을 시
                        existingPot = true; // 이미 존재하던 솥이라고 판별
                        
                        if (this.block.typeId === "fs:empty_mess_kit" && state >= 2) break;
                        if (this.block.typeId === "fs:empty_small_pot" && state >= 3) break;
                        if (this.block.typeId === "fs:empty_big_pot" && state >= 4) break;
                
                        for (let j = 4; j < 8; j++) {
                            if (pot[i + j] == "none") { // 재료가 없는 칸일 시
                                pot[i + j] = mainhand.typeId;
                                if (this.player.getGameMode() != "creative") {
                                    this.player.runCommandAsync(`clear @s ${mainhand.typeId} 0 1`);
                                }
                                this.block.setPermutation(this.block.permutation.withState("fs:cooking_state", state + 1));
                                this.block.dimension.playSound("mob.dolphin.splash", this.block.center(), {
                                    volume: 1,
                                    pitch: 1.2
                                });
                                break;
                            }
                        }
                        break;
                    }
                }
                if (!existingPot) { // 일치하는 좌표가 없을 시
                    if (this.player.getGameMode() != "creative") {
                        this.player.runCommandAsync(`clear @s ${mainhand.typeId} 0 1`);
                    }
                    pot.push(this.dimension, this.x, this.y, this.z, mainhand.typeId, "none", "none", "none");
                    this.block.setPermutation(this.block.permutation.withState("fs:cooking_state", 1));
                    this.block.dimension.playSound("mob.dolphin.splash", this.block.center(), {
                        volume: 1,
                        pitch: 1.2
                    });
                }
                const updatedPotString = pot.join(','); // 솥 데이터 갱신
                world.setDynamicProperty("cookingPot", updatedPotString);
            }
        }
    }

    breakCookingPot() { // 솥 파괴 시
        let potString = world.getDynamicProperty("cookingPot") || ""; // 솥 데이터 문자열 로드
        let pot = potString.split(','); // 문자열을 배열로 변환

        for (let i = 1; i <= pot.length; i += 8) { // 솥 데이터 배열 탐색 시작
            const dimension = pot[i];
            const x = pot[i + 1];
            const y = pot[i + 2];
            const z = pot[i + 3];
            if (x == this.x && y == this.y && z == this.z && dimension == this.dimension) {
                for (let j = 1; j <= 4; j++) {
                    if (pot[i + 3 + j] != "none") {
                        const potItem = new ItemStack(pot[i+3+j], 1)
                        world.getDimension(this.dimension).spawnItem(potItem, this.block.location);
                    }
                    else {
                        break;
                    }
                }
                pot.splice(i, 8);
                const updatedPotString = pot.join(','); // 솥 데이터 갱신
                world.setDynamicProperty("cookingPot", updatedPotString);
                break;
            }
        }
    }

    interactCompletePot() { // 요리 상호작용 시
        let completePotString = world.getDynamicProperty("completePot") || ""; // 완성솥 데이터 로드
        let completePot = completePotString.split(',');

        let existingPot = false; // 존재하던 솥인지 판별할 플래그

        for (let i = 1; i <= completePot.length; i += 6) { // 완성솥 데이터 배열 탐색 시작
            const dimension = completePot[i];
            const x = completePot[i + 1];
            const y = completePot[i + 2];
            const z = completePot[i + 3];
            if (x == this.x && y == this.y && z == this.z && dimension == this.dimension) {
                existingPot = true; // 이미 존재하던 솥이라고 판별

                const equippable = this.player.getComponent("minecraft:equippable");
                const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
                const state = this.block.permutation.getState("fs:eating_state");

                if (mainhand && mainhand.typeId === "fs:plate" && state === 3) {
                    this.player.runCommandAsync(`clear @s ${mainhand.typeId} 0 1`);
                    const plate = new ItemStack(completePot[i+4], 1)
                    if (this.player.getComponent("inventory").container.emptySlotsCount === 0) {
                        const blockLocation = {
                            x: this.x + 0.5, y: this.y + 0.5, z: this.z + 0.5
                        }
                        world.getDimension(this.dimension).spawnItem(plate, blockLocation);
                    }
                    else this.player.getComponent("inventory").container.addItem(plate);
                    this.block.dimension.playSound("random.pop", this.block.center(), {
                        volume: 1,
                        pitch: 1
                    });
                    this.block.setPermutation(BlockPermutation.resolve(completePot[i + 5]));
                }
                else {
                    const potFood = food[completePot[i + 4]];
                    if (!potFood) return;
                    if (potFood.onEat) potFood.onEat(this.player);
                    if (potFood.effects) {
                        for (const effect of potFood.effects){
                            this.player.addEffect(effect.id, effect.duration, {
                                amplifier: effect.amplifier,
                                showParticles: effect.showParticles
                            });
                        }
                    }
                    if (potFood.eatNoise) {
                        const sound = potFood.eatNoise;
                        this.block.dimension.playSound(sound.id, this.block.center(), {
                            volume: sound.volume,
                            pitch: sound.pitch
                        });
                    }
                    this.block.setPermutation(this.block.permutation.withState("fs:eating_state", state - 1))
                }
                if (state - 1 <= 0) {
                    this.block.setPermutation(BlockPermutation.resolve(completePot[i + 5]));
                    completePot.splice(i, 6);
                }
                const updatedCompletePotString = completePot.join(','); // 요리 데이터 갱신
                world.setDynamicProperty("completePot", updatedCompletePotString);
                break;
            }
        }
        if (!existingPot) {
            this.block.setPermutation(BlockPermutation.resolve("minecraft:air"));
        }
    }

    breakCompletePot() { // 요리 파괴 시
        let completePotString = world.getDynamicProperty("completePot") || ""; // 완성솥 데이터 로드
        let completePot = completePotString.split(',');

        for (let i = 1; i <= completePot.length; i += 6) { // 솥 데이터 배열 탐색 시작
            const dimension = completePot[i];
            const x = completePot[i + 1];
            const y = completePot[i + 2];
            const z = completePot[i + 3];
            if (x == this.x && y == this.y && z == this.z && dimension == this.dimension) {
                completePot.splice(i, 6);
                const updatedCompletePotString = completePot.join(','); // 솥 데이터 갱신
                world.setDynamicProperty("completePot", updatedCompletePotString);
                break;
            }
        }
    }
}
