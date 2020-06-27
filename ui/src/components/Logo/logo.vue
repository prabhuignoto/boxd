<template>
  <div class="app-main-logo">
    <span class="app-logo-txt">
      B
    </span>
    <span class="backdrop"></span>
  </div>
</template>

<script lang="ts">
export default {
  name: "Logo",
};
</script>

<style lang="scss" scoped>
.app-main-logo {
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
  align-items: center;
  align-self: flex-start;
  color: #fff;
  display: flex;
  font-family: Open Sans, Arial, Helvetica, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  height: 100%;
  justify-content: center;
  justify-self: flex-start;
  min-width: 52px;
  padding-bottom: 0.5rem;
  padding-left: 34px;
  position: relative;
  text-align: left;
  text-shadow: 0 1px #000;
  transform: scale(0.8);

  &::after {
    background: #2b2d42;
    border-radius: 8px;
    content: "";
    height: 40px;
    left: 0;
    left: 1.45rem;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 40px;
  }

  .backdrop {
    background: #646675;
    border-radius: 10px;
    content: "";
    height: 56px;
    left: 1rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%) rotate(-45deg);
    width: 56px;
  }

  .app-logo-txt {
    align-items: center;
    display: flex;
    justify-content: center;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    right: 0;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 1;
  }
}
</style>
