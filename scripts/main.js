console.warn(`불러옴`);
import { world, system } from "@minecraft/server";

//엔티티가 죽는 순간 실행될 코드들
import { entityDie } from "events/after/entityDie/index";
world.afterEvents.entityDie.subscribe((eventData) => {
    entityDie(eventData);
});

//엔티티가 엔티티를 때리는 순간(근접공격) 실행될 코드들
import { entityHitEntity } from "events/after/entityHitEntity/index";
world.afterEvents.entityHitEntity.subscribe((eventData) => {
    entityHitEntity(eventData);
});

//엔티티가 데미지를 입는 순간 실행될 코드들
import { entityHurt } from "events/after/entityHurt/index";
world.afterEvents.entityHurt.subscribe((eventData) => {
    entityHurt(eventData);
});

// 충전형 아이템 충전 완료 시 실행될 코드
import { itemCompleteUse } from "events/after/itemCompleteUse/index";
world.afterEvents.itemCompleteUse.subscribe((eventData) => {
    itemCompleteUse(eventData);
});

// 충전형 아이템 충전 후 사용 시 실행될 코드
import { itemReleaseUse } from "events/after/itemReleaseUse/index";
world.afterEvents.itemReleaseUse.subscribe((eventData) => {
    itemReleaseUse(eventData);
});

// 아이템 사용 시 실행될 코드
import { itemUse } from "events/after/itemUse/index";
world.afterEvents.itemUse.subscribe((eventData) => {
    itemUse(eventData);
});

// 플레이어가 블록 완전 파괴 시 실행될 코드(파괴 중 멈추면 실행 안 됨)
import { playerBreakBlock } from "events/after/playerBreakBlock/index";
world.afterEvents.playerBreakBlock.subscribe((eventData) => {
    playerBreakBlock(eventData);
});

// 플레이어 스폰 시 실행될 코드
import { playerSpawn } from "events/after/playerSpawn/index";
world.afterEvents.playerSpawn.subscribe((eventData) => {
    playerSpawn(eventData);
});

// 엔티티가 탄알에 맞는 순간 실행될 코드
import { projectileHitEntity } from 'events/after/projectileHitEntity/index';
world.afterEvents.projectileHitEntity.subscribe((eventData) => {
    projectileHitEntity(eventData);
});



// 블록과 상호작용 직전 실행될 코드
import { playerInteractBlockB } from "events/before/playerInteractBlock/index";
world.beforeEvents.playerInteractWithBlock.subscribe((eventData) => { 
    playerInteractBlockB(eventData);
});

// 세계 실행 시 등록될 컴포넌트
import { worldInitialize } from "events/before/worldInitialize/index";
world.beforeEvents.worldInitialize.subscribe((eventData)=>{
    worldInitialize.load(eventData);
});


//1틱에 1번 반복 시 워치독 경고(서버 부하) 가능성 있음
//게임 내내 반복될 코드 (2틱에 1번)
import { runInterval2 } from "events/runInterval/index2"
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        runInterval2(player);
    }
}, 2)

//게임 내내 반복될 코드 (20틱에 1번)
import { runInterval20 } from "events/runInterval/index20"
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        runInterval20(player);
    }
}, 20)
