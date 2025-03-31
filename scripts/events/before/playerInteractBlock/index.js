import { world, system, EquipmentSlot } from "@minecraft/server";
import { releaseWeapon } from "data/rangedWeapon";
import { weaponUpgrade } from "./weaponUpgrade"

export function playerInteractBlockB(eventData) {
    const block = eventData.block;
    const player = eventData.player;
    /* 테스트 코드
    const equippable = player.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);

    switch (block.typeId) {
        case "minecraft:smithing_table":
            const job = world.scoreboard.getObjective("job").getScore(player);
            if (job !== 1) { // 스코어 체크
                eventData.cancel = true; // 조건 불일치 시 상호작용 못하게 함
                player.sendMessage("당신은 아직 이 조합대를 사용할 줄 모릅니다.");
            }
            break;
        case "minecraft:frame":
            if (!mainhand || !releaseWeapon.find(w => w.weaponName === mainhand.typeId)) {
                eventData.cancel = true;
                player.sendMessage("액세서리를 부착 / 분리하려는 총을 들고 사용해주세요");
            } else {
                system.run(() => { weaponUpgrade(player, equippable) });
            }
            break;
        case "minecraft:cauldron":
            if (!mainhand) return;
            else if (mainhand.typeId === "minecraft:diamond_sword") {
                system.run(() => { block.setType("minecraft:composter") });
            }
            break;        
    }*/
}
