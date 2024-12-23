// 1초에 한 번 실행될 코드
import { EquipmentSlot } from "@minecraft/server";

export function runInterval20(player) {
    const playerFire = player.getComponent("minecraft:onfire"); // 불 붙은 플레이어 확인
    const burns = player.getDynamicProperty("burns"); // 화상 값 확인
    if (!playerFire && burns > 0) player.setDynamicProperty("burns", burns - 1);

    armorCheck(player);
} //불이 안붙었는데 화상 값이 존재한다면 1초에 1씩 내려감

function armorCheck(player) {
    const equippable = player.getComponent("minecraft:equippable");
    const head = equippable.getEquipmentSlot(EquipmentSlot.Head);
    const chest = equippable.getEquipmentSlot(EquipmentSlot.Chest);
    const legs = equippable.getEquipmentSlot(EquipmentSlot.Legs);
    const feet = equippable.getEquipmentSlot(EquipmentSlot.Feet);
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    const offhand = equippable.getEquipmentSlot(EquipmentSlot.Offhand);
}