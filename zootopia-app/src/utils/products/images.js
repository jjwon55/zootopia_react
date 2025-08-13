// 상품 이미지들
import dogFood from '../../assets/img/products/fooddogheartbeam.png';
import catToy from '../../assets/img/products/toycatrod.png';
import petCarrier from '../../assets/img/products/productpetcarriage.png';
import birdFood from '../../assets/img/products/foodbirdfallinlove.png';
import dogBall from '../../assets/img/products/toydogball.png';
import catBowl from '../../assets/img/products/productcatwaterbowl.png';
import dogHarness from '../../assets/img/products/productdogharness.png';
import petShampoo from '../../assets/img/products/productpetshampoo.png';

// 추가 이미지들
import birdRopeType from '../../assets/img/products/birdropetype.png';
import birdToy from '../../assets/img/products/birdtoy.png';
import foodBirdOwlSee from '../../assets/img/products/foodbirdowlsee.png';
import foodBirdScream from '../../assets/img/products/foodbirdscream.png';
import foodCatFifty from '../../assets/img/products/foodcatfifty.png';
import foodCatFishTaste from '../../assets/img/products/foodcatfishtaste.png';
import foodCatGoddu from '../../assets/img/products/foodcatgoddu.png';
import foodDogAddyLovesIt from '../../assets/img/products/foodddogaddylovesit.png';
import foodDogAndCatDried from '../../assets/img/products/fooddogandcatdried.png';
import foodDogCatMoistured from '../../assets/img/products/fooddogcatmoistured.png';
import foodDogGum1 from '../../assets/img/products/fooddoggum1.png';
import foodDogMeat from '../../assets/img/products/fooddogmeat.png';
import lizardFeedPlate from '../../assets/img/products/lizardfeedplate.png';
import lizardPackage from '../../assets/img/products/lizardpackage.png';
import lizardTeralium from '../../assets/img/products/lizardteralium.png';
import petContainerSpray from '../../assets/img/products/petcontainerspray.png';
import petDigitalMeasurer from '../../assets/img/products/petdigitalmeasurer.png';
import petFloorPad from '../../assets/img/products/petfloorpad.png';
import petFoodAutoFeeder from '../../assets/img/products/petfoodautofeeder.png';
import petHeatLamp from '../../assets/img/products/petheatlamp.png';
import petPinsetFeed from '../../assets/img/products/petpinsetfeed.png';
import petShelter from '../../assets/img/products/petshelter.png';
import petWaterContainerTypeFeeder from '../../assets/img/products/petwatercontainertypefeeder.png';
import productCatBellNecklace from '../../assets/img/products/productcatbellnecklace.png';
import productCatBowl from '../../assets/img/products/productcatbowl.png';
import productCatHygienePad from '../../assets/img/products/productcathygienepad.png';
import productDogBowl from '../../assets/img/products/productdogbowl.png';
import productDogHygienePad from '../../assets/img/products/productdoghygienepad.png';
import productDogWaterBowl from '../../assets/img/products/productdogwaterbowl.png';
import productHygienePlasticBag from '../../assets/img/products/producthygieneplasticbag.png';
import productHygieneToilet from '../../assets/img/products/producthygienetoilet.png';
import productPetBed from '../../assets/img/products/productpetbed.png';
import productPetCage from '../../assets/img/products/productpetcage.png';
import productPetComb from '../../assets/img/products/productpetcomb.png';
import productPetCousion from '../../assets/img/products/productpetcousion.png';
import productPetCutter from '../../assets/img/products/productpetcutter.png';
import productPetEarCleaner from '../../assets/img/products/productpetearcleaner.png';
import productPetHouse from '../../assets/img/products/productpethouse.png';
import productPetNecklace from '../../assets/img/products/productpetnecklace.png';
import toyCatSmartLaser from '../../assets/img/products/toycatsmartlaser.png';
import toyDogBone from '../../assets/img/products/toydogbone.png';
import toyDogRope from '../../assets/img/products/toydogrope.png';
import walkDogLEDLeash from '../../assets/img/products/walkdogLEDleash.png';
import walkDogNeckLeash from '../../assets/img/products/walkdogneckleash.png';
import walkDogShoes from '../../assets/img/products/walkdogshoes.png';
import walkPetBag from '../../assets/img/products/walkpetbag.png';
import walkWaterContainer from '../../assets/img/products/walkwatercontainer.png';

export {
  dogFood,
  catToy,
  petCarrier,
  birdFood,
  dogBall,
  catBowl,
  dogHarness,
  petShampoo,
  birdRopeType,
  birdToy,
  foodBirdOwlSee,
  foodBirdScream,
  foodCatFifty,
  foodCatFishTaste,
  foodCatGoddu,
  foodDogAddyLovesIt,
  foodDogAndCatDried,
  foodDogCatMoistured,
  foodDogGum1,
  foodDogMeat,
  lizardFeedPlate,
  lizardPackage,
  lizardTeralium,
  petContainerSpray,
  petDigitalMeasurer,
  petFloorPad,
  petFoodAutoFeeder,
  petHeatLamp,
  petPinsetFeed,
  petShelter,
  petWaterContainerTypeFeeder,
  productCatBellNecklace,
  productCatBowl,
  productCatHygienePad,
  productDogBowl,
  productDogHygienePad,
  productDogWaterBowl,
  productHygienePlasticBag,
  productHygieneToilet,
  productPetBed,
  productPetCage,
  productPetComb,
  productPetCousion,
  productPetCutter,
  productPetEarCleaner,
  productPetHouse,
  productPetNecklace,
  toyCatSmartLaser,
  toyDogBone,
  toyDogRope,
  walkDogLEDLeash,
  walkDogNeckLeash,
  walkDogShoes,
  walkPetBag,
  walkWaterContainer
};

// 서버에서 내려오는 이미지 경로('/assets/dist/img/products/파일명')를
// Vite 번들된 로컬 에셋으로 매핑하기 위한 파일명→모듈 URL 매핑 테이블
export const imagesByFilename = {
  // 서버 더미와 정확히 일치하는 파일명
  'foodbirdfallinlove.png': birdFood,
  'foodbirdowlsee.png': foodBirdOwlSee,
  'foodbirdscream.png': foodBirdScream,
  'foodcatfifty.png': foodCatFifty,
  'foodcatfishtaste.png': foodCatFishTaste,
  'foodcatgoddu.png': foodCatGoddu,
  'foodddogaddylovesit.png': foodDogAddyLovesIt,
  'fooddogandcatdried.png': foodDogAndCatDried,
  'fooddogcatmoistured.png': foodDogCatMoistured,
  'fooddoggum1.png': foodDogGum1,
  'fooddogheartbeam.png': dogFood,
  'fooddogmeat.png': foodDogMeat,
  'productcatbellnecklace.png': productCatBellNecklace,
  'productcatbowl.png': productCatBowl,
  'productcathygienepad.png': productCatHygienePad,
  'productcatwaterbowl.png': catBowl,
  'productdogbowl.png': productDogBowl,
  'productdogharness.png': dogHarness,
  'productdoghygienepad.png': productDogHygienePad,
  'productdogwaterbowl.png': productDogWaterBowl,
  'producthygieneplasticbag.png': productHygienePlasticBag,
  'producthygienetoilet.png': productHygieneToilet,
  'productpetbed.png': productPetBed,
  'productpetcage.png': productPetCage,
  'productpetcarriage.png': petCarrier,
  'productpetcomb.png': productPetComb,
  'productpetcousion.png': productPetCousion,
  'productpetcutter.png': productPetCutter,
  'productpetearcleaner.png': productPetEarCleaner,
  'productpethouse.png': productPetHouse,
  'productpetnecklace.png': productPetNecklace,
  'productpetshampoo.png': petShampoo,
  'toydogball.png': dogBall,
  'walkpetbag.png': walkPetBag,
  // 서버 파일명과 로컬 파일명이 다른 경우 근사치 매핑
  'toycatfishingrod.png': catToy,            // ~ cat rod
  'toypetrope.png': toyDogRope,              // pet rope → dog rope
  'toylaserpointer.png': toyCatSmartLaser,   // laser pointer → smart laser
  'toychewingbone.png': toyDogBone,          // chewingbone → dog bone
  'walkdogleash.png': walkDogNeckLeash,      // leash → neck leash
  'walklednecklace.png': walkDogLEDLeash,    // led necklace → LED leash
  'walkpetshoes.png': walkDogShoes,          // pet shoes → dog shoes
  'walkwaterbottle.png': walkWaterContainer, // water bottle → container
  // 카트 더미 전용 jpg 이름 대응
  'dogfood.jpg': dogFood,
  'cattoy.jpg': catToy,
  'petset.jpg': productPetCage,
  'default.jpg': productPetBed,
};
