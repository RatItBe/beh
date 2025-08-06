import { EquipmentSlot } from "@minecraft/server";
import { WeaponSystem } from "class/equipment/weaponSystem";
import { BleedSystem } from "class/bleedSystem";

export function entityHitEntity(eventData) {
    const damagingEntity = eventData.damagingEntity // 때린 엔티티 불러옴
    if (damagingEntity.typeId !== "minecraft:player") return; // 플레이어가 때린 게 아니면 종료

    const equippable = damagingEntity.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (!mainhand) return; // 때린 엔티티가 빈 손이면 종료

    const hitEntity = eventData.hitEntity // 맞은 엔티티 불러옴
    const meleeDamage = mainhand.getDynamicProperty("meleeDamage") || ""; // 근접 데미지 값 불러옴
    if (meleeDamage) { // 근접 데미지 값이 있으면
        WeaponSystem.meleeAttack(damagingEntity, hitEntity, mainhand); // 공격 계산
        return;
    }
    else if (mainhand.typeId.includes("revive")) { // 때릴 때 사용한 아이템이 부활 아이템류라면
        if ((hitEntity.hasTag("bleeding_out") === true)) {
            BleedSystem.othersRevive(damagingEntity, hitEntity, mainhand.typeId); // 부활 시작
            return;
        }
    }
}