import { EquipmentSlot, ItemStack } from "@minecraft/server";
import { releaseWeaponList } from 'data/gun';
import { BleedSystem } from "class/bleedSystem";

export function itemCompleteUse(eventData) {
    const item = eventData.itemStack; // 사용된 아이템을 item 변수에 저장
    const player = eventData.source; // 아이템 사용자를 player 변수에 저장

    const weapon = releaseWeaponList.find(w => w.emptyWeaponName === item.typeId);
    if (weapon) {
        reloadGun(player, weapon)
    }
    else if (item.typeId.includes("revive")) {
        if ((player.getDynamicProperty("bleed") === true) && (player.getDynamicProperty("reviveCooldown") < 1)) {
            BleedSystem.selfRevive(player, item.typeId);
        }
    }
}

function reloadGun(player, weapon) {
    const equippable = player.getComponent("minecraft:equippable"); // 장비칸 전체 저장
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand); //오른손에 든 템 저장
    const ammoExist = player.runCommand(`clear @s ${weapon.weaponAmmo} 0 0`).successCount //탄창존재여부 체크
    if (ammoExist) { // 탄창이 있다면
        player.runCommandAsync(`clear @s ${weapon.weaponAmmo} 0 1`); //탄창 소비
        player.runCommandAsync("playsound tile.piston.in @s ~~~ 0.5 1.8 0.2");
        mainhand.setItem(new ItemStack(weapon.weaponName)); //장전된 총으로 변경
        player.setDynamicProperty("reload", 10); // 1초동안 발사 방지
    }
}