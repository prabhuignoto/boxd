<template>
  <div class="notification-container">
    <div class="notification-status" :class="status" :title="status">
      <Loader type="throb" v-if="status === 'running'" />
    </div>
    <div class="notification-message">{{ getMessage }}</div>
    <div class="starttime">{{ this.getStartTime }}</div>
    <div class="endtime">{{ this.getEndTime }}</div>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import Vue from "vue";
import Loader from "../Loader.vue";

import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "NotificationRecord",
  components: {
    Loader,
  },
})
export default class extends Vue {
  @Prop() status;
  @Prop() startTime;
  @Prop() endTime;
  @Prop() jobType;

  get getStartTime(): string {
    return (
      this.startTime &&
      DateTime.fromMillis(this.startTime).toLocaleString(
        DateTime.DATETIME_SHORT
      )
    );
  }

  get getEndTime(): string {
    return (
      this.endTime &&
      DateTime.fromMillis(this.endTime).toLocaleString(DateTime.DATETIME_SHORT)
    );
  }

  get getMessage(): string {
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
  grid-template-columns: 5% 45% repeat(2, 25%);
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
</style>
