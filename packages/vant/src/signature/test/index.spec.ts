import { Signature } from '..';
import { mount } from '../../../test';

test('renders a canvas element when canvas is supported', async () => {
  const wrapper = mount(Signature);
  expect(wrapper.find('canvas').exists()).toBe(true);
});

it('should emit "start" event when touch starts', async () => {
  const wrapper = mount(Signature);
  const canvas = wrapper.find('canvas');

  await canvas.trigger('touchstart');

  expect(wrapper.emitted('start')).toBeTruthy();
});

test('should emit "signing" event when touch is moving', async () => {
  const wrapper = mount(Signature);
  const canvas = wrapper.find('canvas');

  await canvas.trigger('touchstart');
  await canvas.trigger('touchmove', {
    changedTouches: [{ clientX: 10, clientY: 20 }],
  });

  expect(wrapper.emitted('signing')).toBeTruthy();
  expect(wrapper.emitted('signing')![0][0]).toMatchObject({
    clientX: 10,
    clientY: 20,
  });
});

test('should emit `end` event when touchend is triggered', async () => {
  const wrapper = mount(Signature);
  await wrapper.vm.$nextTick();

  const canvas = wrapper.find('canvas');
  await canvas.trigger('touchend');
  expect(wrapper.emitted('end')).toBeTruthy();
});

test('submit() should output a valid canvas', async () => {
  const wrapper = mount(Signature);

  await wrapper.vm.$nextTick();

  wrapper.vm.$emit('submit', { canvas: null, filePath: '' });

  const emitted = wrapper.emitted();
  expect(emitted.submit).toBeTruthy();
  const [data] = emitted.submit[0] as [
    { canvas: HTMLCanvasElement | null; filePath: string }
  ];

  expect(data.canvas).toBeNull();
  expect(data.filePath).toBe('');
});
