import { MeleeWeaponSystem } from "class/meleeWeaponSystem";

// 0.1초에 한 번 실행될 코드
export function runInterval2(player) {
    MeleeWeaponSystem.cooldownCheck(player);
}
