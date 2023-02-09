<template>
	<div class="crontab">
		<el-button class="language" type="primary" link style="margin-top: 4px" @click="switchLang">{{ i18n }}</el-button>
		<el-scrollbar height="260px">
			<el-tabs type="border-card">
				<el-tab-pane>
					<template #label>
						<span>
							{{ text.Seconds.name }}
						</span>
					</template>
					<div class="tabBody">
						<el-row>
							<el-radio v-model="second.cronEvery" label="1">{{ text.Seconds.every }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="second.cronEvery" label="2"
								>{{ text.Seconds.interval[0] }}
								<el-input-number v-model="second.incrementIncrement" size="small" :min="1" :max="60"></el-input-number>
								{{ text.Seconds.interval[1] || '' }}
								<el-input-number v-model="second.incrementStart" size="small" :min="0" :max="59"></el-input-number>
								{{ text.Seconds.interval[2] || '' }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="second.cronEvery" class="long" label="3"
								>{{ text.Seconds.specific }}
								<el-select v-model="second.specificSpecific" size="small" multiple>
									<el-option v-for="val in 60" :key="val" :value="val - 1">{{ val - 1 }}</el-option>
								</el-select>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="second.cronEvery" label="4"
								>{{ text.Seconds.cycle[0] }}
								<el-input-number v-model="second.rangeStart" size="small" :min="1" :max="60"></el-input-number>
								{{ text.Seconds.cycle[1] || '' }}
								<el-input-number v-model="second.rangeEnd" size="small" :min="0" :max="59"></el-input-number>
								{{ text.Seconds.cycle[2] || '' }}
							</el-radio>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane>
					<template #label>
						<span>
							{{ text.Minutes.name }}
						</span>
					</template>
					<div class="tabBody">
						<el-row>
							<el-radio v-model="minute.cronEvery" label="1">{{ text.Minutes.every }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="minute.cronEvery" label="2"
								>{{ text.Minutes.interval[0] }}
								<el-input-number v-model="minute.incrementIncrement" size="small" :min="1" :max="60"></el-input-number>
								{{ text.Minutes.interval[1] }}
								<el-input-number v-model="minute.incrementStart" size="small" :min="0" :max="59"></el-input-number>
								{{ text.Minutes.interval[2] || '' }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="minute.cronEvery" class="long" label="3"
								>{{ text.Minutes.specific }}
								<el-select v-model="minute.specificSpecific" size="small" multiple>
									<el-option v-for="val in 60" :key="val" :value="val - 1">{{ val - 1 }}</el-option>
								</el-select>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="minute.cronEvery" label="4"
								>{{ text.Minutes.cycle[0] }}
								<el-input-number v-model="minute.rangeStart" size="small" :min="1" :max="60"></el-input-number>
								{{ text.Minutes.cycle[1] }}
								<el-input-number v-model="minute.rangeEnd" size="small" :min="0" :max="59"></el-input-number>
								{{ text.Minutes.cycle[2] }}
							</el-radio>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane>
					<template #label>
						<span>
							{{ text.Hours.name }}
						</span>
					</template>
					<div class="tabBody">
						<el-row>
							<el-radio v-model="hour.cronEvery" label="1">{{ text.Hours.every }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="hour.cronEvery" label="2"
								>{{ text.Hours.interval[0] }}
								<el-input-number v-model="hour.incrementIncrement" size="small" :min="0" :max="23"></el-input-number>
								{{ text.Hours.interval[1] }}
								<el-input-number v-model="hour.incrementStart" size="small" :min="0" :max="23"></el-input-number>
								{{ text.Hours.interval[2] }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="hour.cronEvery" class="long" label="3"
								>{{ text.Hours.specific }}
								<el-select v-model="hour.specificSpecific" size="small" multiple>
									<el-option v-for="val in 24" :key="val" :value="val - 1">{{ val - 1 }}</el-option>
								</el-select>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="hour.cronEvery" label="4"
								>{{ text.Hours.cycle[0] }}
								<el-input-number v-model="hour.rangeStart" size="small" :min="0" :max="23"></el-input-number>
								{{ text.Hours.cycle[1] }}
								<el-input-number v-model="hour.rangeEnd" size="small" :min="0" :max="23"></el-input-number>
								{{ text.Hours.cycle[2] }}
							</el-radio>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane>
					<template #label>
						<span>
							{{ text.Day.name }}
						</span>
					</template>
					<div class="tabBody">
						<el-row>
							<el-radio v-model="day.cronEvery" label="1">{{ text.Day.every }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="2"
								>{{ text.Day.intervalWeek[0] }}
								<el-input-number v-model="week.incrementIncrement" size="small" :min="1" :max="7"></el-input-number>
								{{ text.Day.intervalWeek[1] }}
								<el-select v-model="week.incrementStart" size="small">
									<el-option v-for="val in 7" :key="val" :label="text.Week[val - 1]" :value="val"></el-option>
								</el-select>
								{{ text.Day.intervalWeek[2] }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="3"
								>{{ text.Day.intervalDay[0] }}
								<el-input-number v-model="day.incrementIncrement" size="small" :min="1" :max="31"></el-input-number>
								{{ text.Day.intervalDay[1] }}
								<el-input-number v-model="day.incrementStart" size="small" :min="1" :max="31"></el-input-number>
								{{ text.Day.intervalDay[2] }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" class="long" label="4"
								>{{ text.Day.specificWeek }}
								<el-select v-model="week.specificSpecific" size="small" multiple>
									<el-option
										v-for="val in 7"
										:key="val"
										:label="text.Week[val - 1]"
										:value="['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][val - 1]"
									></el-option>
								</el-select>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" class="long" label="5"
								>{{ text.Day.specificDay }}
								<el-select v-model="day.specificSpecific" size="small" multiple>
									<el-option v-for="val in 31" :key="val" :value="val">{{ val }}</el-option>
								</el-select>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="6">{{ text.Day.lastDay }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="7">{{ text.Day.lastWeekday }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="8"
								>{{ text.Day.lastWeek[0] }}
								<el-select v-model="day.cronLastSpecificDomDay" size="small">
									<el-option v-for="val in 7" :key="val" :label="text.Week[val - 1]" :value="val"></el-option>
								</el-select>
								{{ text.Day.lastWeek[1] || '' }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="9">
								<el-input-number v-model="day.cronDaysBeforeEomMinus" size="small" :min="1" :max="31"></el-input-number>
								{{ text.Day.beforeEndMonth[0] }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="10"
								>{{ text.Day.nearestWeekday[0] }}
								<el-input-number v-model="day.cronDaysNearestWeekday" size="small" :min="1" :max="31"></el-input-number>
								{{ text.Day.nearestWeekday[1] }}
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="day.cronEvery" label="11"
								>{{ text.Day.someWeekday[0] }}
								<el-input-number v-model="week.cronNthDayNth" size="small" :min="1" :max="5"></el-input-number>
								<el-select v-model="week.cronNthDayDay" size="small">
									<el-option v-for="val in 7" :key="val" :label="text.Week[val - 1]" :value="val"></el-option>
								</el-select>
								{{ text.Day.someWeekday[1] }}
							</el-radio>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane>
					<template #label>
						<span>
							{{ text.Month.name }}
						</span>
					</template>
					<div class="tabBody">
						<el-row>
							<el-radio v-model="month.cronEvery" label="1">{{ text.Month.every }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="month.cronEvery" label="2"
								>{{ text.Month.interval[0] }}
								<el-input-number v-model="month.incrementIncrement" size="small" :min="0" :max="12"></el-input-number>
								{{ text.Month.interval[1] }}
								<el-input-number v-model="month.incrementStart" size="small" :min="0" :max="12"></el-input-number>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="month.cronEvery" class="long" label="3"
								>{{ text.Month.specific }}
								<el-select v-model="month.specificSpecific" size="small" multiple>
									<el-option v-for="val in 12" :key="val" :label="val" :value="val"></el-option>
								</el-select>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="month.cronEvery" label="4"
								>{{ text.Month.cycle[0] }}
								<el-input-number v-model="month.rangeStart" size="small" :min="1" :max="12"></el-input-number>
								{{ text.Month.cycle[1] }}
								<el-input-number v-model="month.rangeEnd" size="small" :min="1" :max="12"></el-input-number>
							</el-radio>
						</el-row>
					</div>
				</el-tab-pane>
				<el-tab-pane>
					<template #label>
						<span> {{ text.Year.name }} </span>
					</template>
					<div class="tabBody">
						<el-row>
							<el-radio v-model="year.cronEvery" label="1">{{ text.Year.every }}</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="year.cronEvery" label="2"
								>{{ text.Year.interval[0] }}
								<el-input-number v-model="year.incrementIncrement" size="small" :min="1" :max="99"></el-input-number>
								{{ text.Year.interval[1] }}
								<el-input-number v-model="year.incrementStart" size="small" :min="2018" :max="2118"></el-input-number>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="year.cronEvery" class="long" label="3"
								>{{ text.Year.specific }}
								<el-select v-model="year.specificSpecific" size="small" filterable multiple>
									<el-option v-for="val in 100" :key="val" :label="2017 + val" :value="2017 + val"></el-option>
								</el-select>
							</el-radio>
						</el-row>
						<el-row>
							<el-radio v-model="year.cronEvery" label="4"
								>{{ text.Year.cycle[0] }}
								<el-input-number v-model="year.rangeStart" size="small" :min="2018" :max="2118"></el-input-number>
								{{ text.Year.cycle[1] }}
								<el-input-number v-model="year.rangeEnd" size="small" :min="2018" :max="2118"></el-input-number>
							</el-radio>
						</el-row>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-scrollbar>
		<div class="bottom">
			<p class="value">{{ cron }}</p>
			<el-button size="default" @click="close">{{ text.Close }}</el-button>
			<el-button type="primary" size="default" @click="submit">{{ text.Save }}</el-button>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Language from './language/index'

export default defineComponent({
	name: 'FastCron',
	props: ['data', 'lang'],
	data() {
		return {
			i18n: this.lang,
			second: {
				cronEvery: '',
				incrementStart: 3,
				incrementIncrement: 5,
				rangeStart: '',
				rangeEnd: '',
				specificSpecific: []
			},
			minute: {
				cronEvery: '',
				incrementStart: 3,
				incrementIncrement: 5,
				rangeStart: '',
				rangeEnd: '',
				specificSpecific: []
			},
			hour: {
				cronEvery: '',
				incrementStart: 3,
				incrementIncrement: 5,
				rangeStart: '',
				rangeEnd: '',
				specificSpecific: []
			},
			day: {
				cronEvery: '',
				incrementStart: 1,
				incrementIncrement: 1,
				rangeStart: '',
				rangeEnd: '',
				specificSpecific: [],
				cronLastSpecificDomDay: 1,
				cronDaysBeforeEomMinus: '',
				cronDaysNearestWeekday: ''
			},
			week: {
				cronEvery: '',
				incrementStart: 1,
				incrementIncrement: 1,
				specificSpecific: [],
				cronNthDayDay: 1,
				cronNthDayNth: 1
			},
			month: {
				cronEvery: '',
				incrementStart: 3,
				incrementIncrement: 5,
				rangeStart: '',
				rangeEnd: '',
				specificSpecific: []
			},
			year: {
				cronEvery: '',
				incrementStart: 2017,
				incrementIncrement: 1,
				rangeStart: '',
				rangeEnd: '',
				specificSpecific: []
			},
			output: {
				second: '',
				minute: '',
				hour: '',
				day: '',
				month: '',
				Week: '',
				year: ''
			}
		}
	},
	computed: {
		text(): any {
			return (Language as any)[this.i18n || 'zh-CN']
		},
		secondsText() {
			let seconds = ''
			let cronEvery = this.second.cronEvery
			switch (cronEvery.toString()) {
				case '1':
					seconds = '*'
					break
				case '2':
					seconds = this.second.incrementStart + '/' + this.second.incrementIncrement
					break
				case '3':
					this.second.specificSpecific.map(val => {
						seconds += val + ','
					})
					seconds = seconds.slice(0, -1)
					break
				case '4':
					seconds = this.second.rangeStart + '-' + this.second.rangeEnd
					break
			}
			return seconds
		},
		minutesText() {
			let minutes = ''
			let cronEvery = this.minute.cronEvery
			switch (cronEvery.toString()) {
				case '1':
					minutes = '*'
					break
				case '2':
					minutes = this.minute.incrementStart + '/' + this.minute.incrementIncrement
					break
				case '3':
					this.minute.specificSpecific.map(val => {
						minutes += val + ','
					})
					minutes = minutes.slice(0, -1)
					break
				case '4':
					minutes = this.minute.rangeStart + '-' + this.minute.rangeEnd
					break
			}
			return minutes
		},
		hoursText() {
			let hours = ''
			let cronEvery = this.hour.cronEvery
			switch (cronEvery.toString()) {
				case '1':
					hours = '*'
					break
				case '2':
					hours = this.hour.incrementStart + '/' + this.hour.incrementIncrement
					break
				case '3':
					this.hour.specificSpecific.map(val => {
						hours += val + ','
					})
					hours = hours.slice(0, -1)
					break
				case '4':
					hours = this.hour.rangeStart + '-' + this.hour.rangeEnd
					break
			}
			return hours
		},
		daysText() {
			let days = ''
			let cronEvery = this.day.cronEvery
			switch (cronEvery.toString()) {
				case '1':
					break
				case '2':
				case '4':
				case '11':
					days = '?'
					break
				case '3':
					days = this.day.incrementStart + '/' + this.day.incrementIncrement
					break
				case '5':
					this.day.specificSpecific.map(val => {
						days += val + ','
					})
					days = days.slice(0, -1)
					break
				case '6':
					days = 'L'
					break
				case '7':
					days = 'LW'
					break
				case '8':
					days = this.day.cronLastSpecificDomDay + 'L'
					break
				case '9':
					days = 'L-' + this.day.cronDaysBeforeEomMinus
					break
				case '10':
					days = this.day.cronDaysNearestWeekday + 'W'
					break
			}
			return days
		},
		weeksText() {
			let weeks = ''
			let cronEvery = this.day.cronEvery
			switch (cronEvery.toString()) {
				case '1':
				case '3':
				case '5':
					weeks = '?'
					break
				case '2':
					weeks = this.week.incrementStart + '/' + this.week.incrementIncrement
					break
				case '4':
					this.week.specificSpecific.map(val => {
						weeks += val + ','
					})
					weeks = weeks.slice(0, -1)
					break
				case '6':
				case '7':
				case '8':
				case '9':
				case '10':
					weeks = '?'
					break
				case '11':
					weeks = this.week.cronNthDayDay + '#' + this.week.cronNthDayNth
					break
			}
			return weeks
		},
		monthsText() {
			let months = ''
			let cronEvery = this.month.cronEvery
			switch (cronEvery.toString()) {
				case '1':
					months = '*'
					break
				case '2':
					months = this.month.incrementStart + '/' + this.month.incrementIncrement
					break
				case '3':
					this.month.specificSpecific.map(val => {
						months += val + ','
					})
					months = months.slice(0, -1)
					break
				case '4':
					months = this.month.rangeStart + '-' + this.month.rangeEnd
					break
			}
			return months
		},
		yearsText() {
			let years = ''
			let cronEvery = this.year.cronEvery
			switch (cronEvery.toString()) {
				case '1':
					years = '*'
					break
				case '2':
					years = this.year.incrementStart + '/' + this.year.incrementIncrement
					break
				case '3':
					this.year.specificSpecific.map(val => {
						years += val + ','
					})
					years = years.slice(0, -1)
					break
				case '4':
					years = this.year.rangeStart + '-' + this.year.rangeEnd
					break
			}
			return years
		},
		cron() {
			return `${this.secondsText || '*'} ${this.minutesText || '*'} ${this.hoursText || '*'} ${this.daysText || '*'} ${this.monthsText || '*'} ${
				this.weeksText || '?'
			} ${this.yearsText || '*'}`
		}
	},
	watch: {
		data() {
			this.rest(this.$data)
		},
		lang(vl) {
			this.i18n = vl
		}
	},
	methods: {
		getValue() {
			return this.cron
		},
		submit() {
			this.$emit('submit', this.cron)
			this.close()
		},
		close() {
			this.$emit('close')
		},
		rest(data: any) {
			for (let i in data) {
				if (data[i] instanceof Object) {
					this.rest(data[i])
				} else {
					switch (typeof data[i]) {
						case 'object':
							data[i] = []
							break
						case 'string':
							data[i] = ''
							break
					}
				}
			}
		},
		switchLang() {
			this.i18n = this.i18n === 'en-US' ? 'zh-CN' : 'en-US'
		}
	}
})
</script>
<style lang="scss" scoped>
.crontab {
	.language {
		position: absolute;
		right: 25px;
		z-index: 1;
	}
	.el-tabs {
		box-shadow: none;
	}
	.tabBody {
		.el-row {
			margin: 10px 0;
			.long {
				.el-select {
					width: 350px;
				}
			}
			.el-input-number {
				width: 110px;
			}
		}
	}
	.bottom {
		width: 100%;
		text-align: center;
		margin-top: 5px;
		position: relative;
		.value {
			font-size: 18px;
			vertical-align: middle;
		}
	}
}
</style>
