// @flow

import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'

function createLocalVue (): Component {
  const instance = Vue.extend()

  // clone global APIs
  Object.keys(Vue).forEach(key => {
    if (!instance.hasOwnProperty(key)) {
      const original = Vue[key]
      instance[key] = typeof original === 'object'
        ? cloneDeep(original)
        : original
    }
  })

  // config is not enumerable
  instance.config = cloneDeep(Vue.config)

  // option merge strategies need to be exposed by reference
  // so that merge strats registered by plguins can work properly
  instance.config.optionMergeStrategies = Vue.config.optionMergeStrategies

  // compat for vue-router < 2.7.1 where it does not allow multiple installs
  const use = instance.use
  instance.use = (plugin) => {
    plugin.installed = false
    plugin.install.installed = false
    use.call(instance, plugin)
  }
  return instance
}

export default createLocalVue
