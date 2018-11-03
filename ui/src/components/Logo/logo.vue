<template>
  <div class="app-main-logo">
    <span class="app-logo-txt">
      B
    </span>
    <span class="backdrop"></span>
  </div>
</template>

<script>
export default {
  name: "Logo"
};
</script>

<style lang="scss" scoped>
.app-main-logo {
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
  font-size: 1.75rem;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  justify-self: flex-start;
  align-self: flex-start;
  font-weight: 600;
  text-align: left;
  color: #fff;
  padding-left: 34px;
  position: relative;
  text-shadow: 0px 1px #000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 0.5rem;
  min-width: 50px;
  transform: scale(0.8);
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    background: #2b2d42;
    height: 40px;
    width: 40px;
    left: 1.45rem;
    border-radius: 8px;
  }
  .backdrop {
    content: "";
    background: #646675;
    position: absolute;
    width: 56px;
    height: 56px;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%) rotate(-45deg);
    border-radius: 10px;
    &:after {
      content: "";
      background: #8d99ae;
      position: absolute;
      width: 55px;
      height: 30px;
      right: 0;
      border-radius: 0px 0px 10px 10px;
      top: 28px;
      left: 13px;
      -webkit-transform: translateY(-50%) rotate(-90deg);
      transform: translateY(-50%) rotate(-90deg);
    }
  }
  .app-logo-txt {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
    z-index: 1;
  }
}
</style>
