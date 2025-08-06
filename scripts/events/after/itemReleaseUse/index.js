import { EquipmentSlot } from "@minecraft/server";
import { WeaponSystem } from "class/equipment/weaponSystem";

export function itemReleaseUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;
    const useDuration = eventData.useDuration;

    const equippable = player.getComponent("minecraft:equippable");
    const mainhandSlot = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    const currentAmmo = item.getDynamicProperty("currentAmmo");
    const manaCost = item.getDynamicProperty("manaCost");

    // 잔여 탄약값이 있는 아이템일 시(=일반 총기류 무기일 시)
    if (currentAmmo !== undefined) {
        // 잔여 탄약이 0보다 클 시 발사
        if (currentAmmo > 0) WeaponSystem.rangedAttack(player, mainhandSlot, {"currentAmmo": currentAmmo});
        // 잔여 탄약이 0이거나 그보다 작을 시 장전 시도
        else WeaponSystem.reloadWeapon(player, mainhandSlot, useDuration);
    }
    // 마나 소모값이 있는 아이템일 시(=마법류 무기일 시)
    else if (manaCost !== undefined) {
        WeaponSystem.rangedAttack(player, mainhandSlot, {"manaCost": manaCost});
    }
}
