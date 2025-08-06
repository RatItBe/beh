// 0.2초(4틱)에 한 번 실행될 코드
import { ArmorSystem } from "class/equipment/armorSystem";

export function runInterval4(player) {
    ArmorSystem.armorCheck(player);
}