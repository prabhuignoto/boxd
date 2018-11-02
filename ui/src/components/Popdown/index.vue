<template>
    <section class="popdown-wrapper" :style="getStyle">
      <Button :name="name" :onClick="togglePopdown" :buttonStyle="type" :msize="size">
        <template slot="btn-icon">
          <slot name="icon"></slot>
        </template>
        <template slot="menu">
          <transition name="movein">
            <div class="popdown"
              v-if="visible" tabindex="0"
              @blur="close" @keyup.esc="close"
              :style="{left: leftOffset, width: customWidth, top: topOffset ? topOffset : '100%'}"
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
  props: ["name", "type", "size", "leftOffset", "customWidth", "topOffset"],
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
        width: this.customWidth
      };
    }
  }
};
</script>

<style lang="scss" src="./popdown.scss" scoped/>
