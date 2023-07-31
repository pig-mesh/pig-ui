<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<splitpanes horizontal>
				<pane size="60">
					<splitpanes>
						<pane size="67">
							<splitpanes horizontal>
								<pane size="30">
                  <splitpanes>
                    <pane size="50">
                      <current-user />
                    </pane>
                    <pane size="50">
                      <flow-data />
                    </pane>
                  </splitpanes>
								</pane>
								<pane size="70">
									<favorite />
								</pane>
							</splitpanes>
						</pane>
						<pane size="33">
							<schedule-calendar />
						</pane>
					</splitpanes>
				</pane>
				<pane size="40">
					<splitpanes>
						<pane>
							<sys-log />
						</pane>
						<pane>
							<audit-log />
						</pane>
						<pane>
							<news-letter />
						</pane>
					</splitpanes>
				</pane>
			</splitpanes>
		</div>
	</div>
</template>

<script setup lang="ts" name="home">
const CurrentUser = defineAsyncComponent(() => import('./current-user.vue'));
const Favorite = defineAsyncComponent(() => import('./favorite.vue'));
const ScheduleCalendar = defineAsyncComponent(() => import('./schedule/calendar.vue'));
const SysLog = defineAsyncComponent(() => import('./log-dashboard/sys-log.vue'));
const AuditLog = defineAsyncComponent(() => import('./log-dashboard/audit-log.vue'));
const NewsLetter = defineAsyncComponent(() => import('./newsletter.vue'));
const FlowData = defineAsyncComponent(() => import('./flow-data.vue'));
</script>
