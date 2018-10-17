<template>
    <section class="popdown-wrapper">
      <Button :name="name" :onClick="togglePopdown" :buttonStyle="type" :msize="size">
        <template slot="btn-icon">
          <slot name="icon"></slot>
        </template>
        <template slot="menu">
          <transition name="movein">
            <div class="popdown"
              v-if="visible" tabindex="0"
              @blur="close" @keyup.esc="close"
              :style="{left: leftOffset}"
            >
              <slot name="menu"></slot>
            </div>
          </transition>
        </template>
      </Button>
    </section>
</template>

<script>
import Button from "../Form/Button";

export default {
  name: "Popdown",
  components: {
    Button
  },
  props: ["name", "type", "size", "leftOffset"],
  data() {
    return {
      visible: false
    };
  },
  methods: {
    togglePopdown(ev) {
      const $el = this.$el;
      const popdown = $el && $el.querySelector(".popdown");
      if (popdown && popdown.contains(ev.target)) {
        return false;
      } else {
        this.visible = !this.visible;
        this.$nextTick(function() {
          this.$el.querySelector(".popdown").focus();
        });
      }
    },
    close() {
      this.visible = false;
    },
    getStyle() {
      return {
        'left': `${this.leftOffset}rem`,
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.popdown {
  position: absolute;
  top: 2.5rem;
  margin-left: auto;
  margin-right: auto;
  min-width: 180px;
  min-height: 50px;
  background: #fff;
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
  z-index: 100;
  border-radius: 6px;
  outline: none;
  /* border: 1px solid rgba(0, 126, 229, 0.4); */
  border: 1px solid #ddd;

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: -7px;
    right: 0;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    width: 12px;
    height: 12px;
    background: #fff;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    transform: rotate(45deg);
    z-index: -1;
  }
}
.movein-enter-active,
.movein-leave-active {
  transition: all 0.2s;
  transform: translateY(0%);
}
.movein-enter, .movein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10%);
}
</style>
