import { MeleeWeaponSystem } from "class/weapon/meleeWeaponSystem";

// 0.1초에 한 번 실행될 코드
export function runInterval2(player) {
    player.runCommand(`titleraw @s actionbar {
    "rawtext": [
        {
            "text": "§a스태미나 : "
        },
        {
            "score": {
                "name": "*",
                "objective": "stamina"
            }
        },
        {
            "text": " / §b마나 : "
        },
        {
            "score": {
                "name": "*",
                "objective": "mana"
            }
        },
        {
            "text": " / §6탄알 : "
        },
        {
            "score": {
                "name": "*",
                "objective": "bullet"
            }
        }
    ]
}`);

    MeleeWeaponSystem.cooldownCheck(player);
}


/* 스테이터스 양식
{
    "rawtext": [
        {
            "text": "§a스태미나 : "
        },
        {
            "score": {
                "name": "*",
                "objective": "stamina"
            }
        },
        {
            "text": " / §b마나 : "
        },
        {
            "score": {
                "name": "*",
                "objective": "mana"
            }
        },
        {
            "text": " / §6탄알 : "
        },
        {
            "score": {
                "name": "*",
                "objective": "bullet"
            }
        }
    ]
}*/