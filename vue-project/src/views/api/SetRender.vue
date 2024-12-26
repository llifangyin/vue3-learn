
<script>
import { ref ,h,toRefs,toRef} from 'vue';
export default {
  setup(props,{expose}) {
    const count = ref(0);
    const increment = () => ++count.value

    expose({
      increment
    })
    return () => h('div', count.value)
  },
  mounted() {
    console.log('mounted',this.count);
  },
};
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
  }
}
</style>
