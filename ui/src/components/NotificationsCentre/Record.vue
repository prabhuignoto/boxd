<template>
  <div class="notification-container" @mouseleave="hideClear" @mouseenter="showClear">
    <div class="notification-status" :class="status" :title="status">
      <Loader type="throb" v-if="status === 'running'" />
    </div>
    <div class="notification-message">{{ getMessage }}</div>
    <div class="starttime">{{ this.getStartTime }}</div>
    <div class="endtime">{{ this.getEndTime }}</div>
    <div class="clear-button">
      <div class="clear-icon-wrapper" @click="handleClear">
        <XCircleIcon v-if="clear" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import Vue from "vue";
import Loader from "../Loader.vue";

import { Component, Prop } from "vue-property-decorator";
import { XCircleIcon } from "vue-feather-icons";

@Component({
  name: "NotificationRecord",
  components: {
    Loader,
    XCircleIcon,
  },
})
export default class extends Vue {
  clear = false;

  @Prop() status;
  @Prop() startTime;
  @Prop() endTime;
  @Prop() jobType;
  @Prop() id;

  get getStartTime() {
    return (
      this.startTime &&
      DateTime.fromMillis(this.startTime).toLocaleString(
        DateTime.DATETIME_SHORT
      )
    );
  }

  get getEndTime() {
    return (
      this.endTime &&
      DateTime.fromMillis(this.endTime).toLocaleString(DateTime.DATETIME_SHORT)
    );
  }

  showClear() {
    this.clear = true;
  }

  hideClear() {
    this.clear = false;
  }

  handleClear() {
    this.$emit("clearJob", this.id);
  }

  get getMessage() {
    if (this.jobType === "DELETE") {
      return this.status === "running" ? `Deleting...` : `Deleted`;
    } else if (this.jobType === "UPLOAD") {
      return this.status === "running" ? `Uploading...` : `Uploaded`;
    } else if (this.jobType === "CREATE_FOLDER") {
      return this.status === "running"
        ? `Creating Folder...`
        : `Created New Folder.`;
    } else if (this.jobType === "COPY") {
      return this.status === "running"
        ? `Copying...`
        : `Copied Folder Successfully.`;
    } else if (this.jobType === "MOVE") {
      return this.status === "running" ? `Moving...` : `Moved Successfully`;
    } else {
      return "";
    }
  }
}
</script>

<style lang="scss" scoped>
.notification-container {
  align-items: center;
  background: #fff;
  border-radius: 0.2rem;
  display: grid;
  grid-template-columns: 5% 35% repeat(2, 25%) 10%;
  height: 100%;
  width: 100%;
}

.notification-message {
  font-size: 0.75rem;
  font-weight: 400;
  text-align: left;
  text-transform: lowercase;
}

.notification-status {
  border-radius: 50%;
  height: 10px;
  justify-self: center;
  width: 10px;

  &.completed {
    background: #4bb543;
  }

  &.failed {
    background: #f31431;
  }
}

.starttime,
.endtime {
  font-size: 0.7rem;
  font-weight: 400;
  justify-self: flex-start;
  white-space: nowrap;
}

.clear-button {
  .clear-icon-wrapper {
    color: #007ee5;
    cursor: pointer;
    height: 1.2rem;
    margin-left: 1rem;
    width: 1.2rem;
  }

  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
