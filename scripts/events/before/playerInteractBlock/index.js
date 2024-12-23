import { world, system, EquipmentSlot } from "@minecraft/server";
import { releaseWeaponList } from 'data/gun';

export function playerInteractBlockB(eventData) {
    const block = eventData.block;
    const player = eventData.player;
    const equippable = player.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
    const weapon = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    
    if (block.typeId === "minecraft:smithing_table") { // 블록 체크
        const job = world.scoreboard.getObjective("job").getScore(player);
        if (job !== 1) { // 스코어 체크
            eventData.cancel = true; // 조건 불일치 시 상호작용 못하게 함
            player.sendMessage("당신은 아직 이 조합대를 사용할 줄 모릅니다.");
        }
    }
    else if (block.typeId === "minecraft:frame") {
        if (!mainhand || !releaseWeaponList.find(w => w.weaponName === mainhand.typeId)) {
            eventData.cancel = true;
            player.sendMessage("액세서리를 부착 / 분리하려는 총을 들고 사용해주세요");
        } else {
            system.run(() => { weaponUpgrade(player, weapon) });
        }
    }
    else if (block.typeId === "minecraft:cauldron") {
        if (!mainhand) return;
        else if (mainhand.typeId === "minecraft:diamond_sword") {
            system.run(() => { block.setType("minecraft:composter") });
        }
    }
}
