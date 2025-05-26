本篇文章将简单分析rc-field-form的源码，rc-field-form是一个react表单管理解决方案，antd的form就是基于他进行的封装，如果大家想要了解react表单的主流解决方案，可以阅读[🍓中台表单技术选型实践(表单实践) - 掘金 (juejin.cn)](https://juejin.cn/post/7316723621292638246#heading-13)
## 用法
首先我们来看看rc-field-form的用法

```js
import Form, { useForm, Field } from "../rc-form";

export default () => {
  const [form] = useForm();

  return (
    <Form
      onFinish={(e) => {
        console.log(e);
      }}
      onFinishFailed={(e) => {
        console.log(e);
      }}
      form={form}
    >
      <Field name="name" rules={[{ required: true, max: 4 }]}>
        <input placeholder="Username" />
      </Field>
      <Field name="password" rules={[{ required: true, max: 1 }]}>
        <input placeholder="Username1" />
      </Field>
      <button>Submit</button>
    </Form>
  );
};

```
在这段代码中，使我们使用 Form 组件来新建一个 Form 表单，然后在Field组件里包裹了我们的每一个表单项，并且通过Field的name字段创建表单的key，rules来配置校验。当我们点击button后，会根据是否通过校验来触发onFinsh或者onFinishFailed。

由此我们可以引出一些问题：
- Form组件是如何管理我们的表单数据
- 我们并没有给每个input绑定事件，表单的值是如何更新的
- Form组件如何对我们的数据进行校验
下面就让我们从源码入手来解决这些问题
# **一**·如何实现数据的更新
### Form组件如何管理数据
根据上面的代码，当我们创建Form组件时，必须要给Form组件传入一个通过useForm这个hook得到的form，那么这个form是什么呢？下面是useForm的源码

```js
function useForm(form) {
  const formRef = React.useRef();
  const [, forceUpdate] = React.useState({});

  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      // Create a new FormStore if not provided
      const forceReRender = () => {
        forceUpdate({});
      };

      const formStore: FormStore = new FormStore(forceReRender);

      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current];
}

```
当我们在使用useForm的时候，我们一般不会传入form参数，那么这个hook就会帮我们new一个FormStore，FormStore是一个很重要的类，整个表单数据的存储和操作方法都是由他提供，然后返回Formstore的getForm方法，其实这里就是通过getForm将Formstore里的一些属性和方法暴露了出来。
我们先来简单看下FormStore里都有啥(只展示部分属性和方法)

```js
export class FormStore {
  //new FormStore时传入的setState方法
  private forceRootUpdate

  private subscribabl = true;
//整个表单的数据
  private store: Store = {};
//每个Field组件都会被注册到这个数组里
  private fieldEntities = [];
//初始值
  private initialValues = {};
//存放Form上的onFinish等方法
  private callbacks: Callbacks = {};
  
  constructor(forceRootUpdate: () => void) {
    this.forceRootUpdate = forceRootUpdate;
  }
  //暴露出去给开发者的一些方法
   public getForm = (): InternalFormInstance => ({
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    getFieldWarning: this.getFieldWarning,
    resetFields: this.resetFields,
    setFields: this.setFields,
    setFieldValue: this.setFieldValue,
    setFieldsValue: this.setFieldsValue,
    validateFields: this.validateFields,
    submit: this.submit,
    getInternalHooks: this.getInternalHooks,
    ......
  });
    private getInternalHooks = (key: string): InternalHooks | null => {
    //只提供给内部组件的方法，开发者在其他组件无法调用，这里的HOOK_MAR是Field组件通过context获得的
    if (key === HOOK_MARK) {
      this.formHooked = true;

      return {
        dispatch: this.dispatch,
        initEntityValue: this.initEntityValue,
        registerField: this.registerField,
        useSubscribe: this.useSubscribe,
        setInitialValues: this.setInitialValues,
        destroyForm: this.destroyForm,
        setCallbacks: this.setCallbacks,
        setValidateMessages: this.setValidateMessages,
        getFields: this.getFields,
        setPreserve: this.setPreserve,
        getInitialValue: this.getInitialValue,
        registerWatch: this.registerWatch,
      };
    }

    warning(false, '`getInternalHooks` is internal usage. Should not call directly.');
    return null;
  };
```
还有很多方法感觉太多了这里没有列举，我们直接按流程进行分析理解，上面我们讲到了Form组件需要传入form，而form是FormStore通过getForm暴露出的一些属性和方法接下来我们来看看Form组件是如何消费form的


```js
//formcontext是用于全局form管理的暂不分析
const formContext: FormContextProps = React.useContext(FormContext);
//拿到FormStore暴露的属性，方法
  const [formInstance] = useForm(form);
  const {
    useSubscribe,
    setInitialValues,
    setCallbacks,
    setValidateMessages,
    setPreserve,
    destroyForm,
  } = (formInstance as InternalFormInstance).getInternalHooks(HOOK_MARK);

  // 转发ref让外部可以通过ref调用
  React.useImperativeHandle(ref, () => formInstance);

  //全局管理有关
  React.useEffect(() => {
    formContext.registerForm(name, formInstance);
    return () => {
      formContext.unregisterForm(name);
    };
  }, [formContext, formInstance, name]);

  //设置validateMessage
  setValidateMessages({
    ...formContext.validateMessages,
    ...validateMessages,
  });
  //注册form表单上传入的方法
  setCallbacks({
    onValuesChange,
    onFieldsChange: (changedFields: FieldData[], ...rest) => {
      formContext.triggerFormChange(name, changedFields);

      if (onFieldsChange) {
        onFieldsChange(changedFields, ...rest);
      }
    },
    onFinish: (values: Store) => {
      formContext.triggerFormFinish(name, values);

      if (onFinish) {
        onFinish(values);
      }
    },
    onFinishFailed,
  });
  setPreserve(preserve);
```
大概就是为FormStore初始化一些东西，对主流程影响不大，我们继续看，下面来到了创建初始值

```js
//判断是否为首次渲染，首次渲染就创建初始值
  const mountRef = React.useRef(null);
  setInitialValues(initialValues, !mountRef.current);
  if (!mountRef.current) {
    mountRef.current = true;
  }
//每次重新渲染时重置Form
  React.useEffect(
    () => destroyForm,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

```
我们先来看setInitialValues这个方法

```js
  private setInitialValues = (initialValues: Store, init: boolean) => {
    this.initialValues = initialValues || {};
    if (init) {
    //merge方法是rc-util提供的工具函数，rc-field-form里的很多操作都用到了里面的函数，这里不做分析
      let nextStore = merge(initialValues, this.store);
    //非主要流程跳过
      this.prevWithoutPreserves?.map(({ key: namePath }) => {
        nextStore = setValue(nextStore, namePath, getValue(initialValues, namePath));
      });
      this.prevWithoutPreserves = null;

      this.updateStore(nextStore);
    }
  };
```
我们可以看到setinitalValues方法最后调用了updateStore，这个方法很简单

```js
  private updateStore = (nextStore: Store) => {
    this.store = nextStore;
  };
```
直接修改了store，接下来是对child不同type的一些处理

```js
  let childrenNode: React.ReactNode;
  const childrenRenderProps = typeof children === 'function';
  if (childrenRenderProps) {
    const values = formInstance.getFieldsValue(true);
    childrenNode = (children as RenderProps)(values, formInstance);
  } else {
    childrenNode = children;
  }
```
如果child是一个函数，则传入childNode为函数返回值,这里的getFieldsValue方法参数为true时返回的就是整个store，也可以传入Field的name数组获取指定的value，具体实现不做分析。继续继续😊

```js
const formContextValue = React.useMemo(
    () => ({
      ...(formInstance as InternalFormInstance),
      validateTrigger,
    }),
    [formInstance, validateTrigger],
  );
```
然后我们创建了一个context，传入formInstance(FormStore暴露的方法和数据)，还有一个validateTrigger，这个我们之前没有提到，这个属性是用户传给Form组件的，他的默认值是onChange,也就是说在onChange的时候会触发Field组件的validate。马上就到尾声了(其实是Form的尾声，后面还有一堆)

```js
  const wrapperNode = (
    <ListContext.Provider value={null}>
      <FieldContext.Provider value={formContextValue}>{childrenNode}</FieldContext.Provider>
    </ListContext.Provider>
  );
```
接下创建一个wrapperNode，其实就是一个contextProvider，ListContext.Provider这个应该是为List组件服务的我们暂不关心，然后我们可以看到FieldContext.Provider就是提供了formInstance和validateTrigger，这样我们的Field组件也可以访问和操作formInstance啦。
然后就是我们最后的代码

```js
  if (Component === false) {
    return wrapperNode;
  }

  return (
    <Component
      {...restProps}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        formInstance.submit();
      }}
      onReset={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        formInstance.resetFields();
        restProps.onReset?.(event);
      }}
    >
      {wrapperNode}
    </Component>
  );
};
```
这里的Component也是由用户传入的，默认值为'form'，所以最后的效果其实是
```js    
    <form
      {...restProps}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        formInstance.submit();
      }}
      onReset={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        formInstance.resetFields();
        restProps.onReset?.(event);
      }}
    >
      {wrapperNode}
    </form>
```
这里阻止了一下form的默认行为，然后会在submit和reset时执行formInstance的方法。

到这里我们先总结一下，Form组件都干了什么
- 首先他拿到了form然后setCallbacks，setInitialValues对forminstance的callback和store进行了初始化
- 然后对children进行了处理，用FieldContext将它包裹，让Field组件可以拿到formInstance等一些东西
- 最后用form标签将处理后的child包裹起来，将事件进行绑定
### Field如何消费数据
接下来让我们继续看看Feld组件，Field组件有一点特殊，他是一个class组件🤔，源码中注释是
` We use Class instead of Hooks here since it will cost much code by using Hooks.`大概意思是通过class组件的方式实现可以减少代码量。我们先来看看Field组件大致的代码结构。
```js
class Field extends React.Component<InternalFieldProps, FieldState> implements FieldEntity {
    //传入的formInstance
    public static contextType = FieldContext;
    //组件默认参数
    public static defaultProps
    //定义一个state用于触发rerender
    public state 
    //用于组件卸载时清除formInstance里数据
    private cancelRegisterFunc
    //是否已挂载
    private mounted = false;
    //表单校验结果的Promise
    private validatePromise
    //校验结果error
    private errors
    //校验结果 warning
    private warnings
  
    constructor(props) {
        super()
        ..........
    }
  
    public componentDidMount
  
    public componentWillUnmount() {
    }
    //会调用并销毁cancelRegisterFunc
    public cancelRegister
    //获取Field的name
    public getNamePath
    //获取传入的rules
    public getRules
    //用于更新组件
    public reRender
    public refresh
    // ========================= 这个方法很重要，跟组件更新相关 ==============================
    public onStoreChange
    //校验rulues的方法
    public validateRules
    public isFieldValidating = () => !!this.validatePromise;
   //获取校验后的结果
    public getErrors
    public getWarnings
   //对传入的child的一些处理
    public getOnlyChild
    //返回当前Field字段的值
    public getValue
    // ======== 就是这个方法让我们传入的组件受控，劫持了组件的onChange这类事件 ====================
    public getControlled
    //返回处理后的子组件
    public render() {
    
    }
  }
```
了解了大体结构，接下来我们先从constructor入手，看看Field组件的渲染流程。

```js
  constructor(props: InternalFieldProps) {
    super(props);

    // Register on init
    if (props.fieldContext) {
      const { getInternalHooks }: InternalFormInstance = props.fieldContext;
      const { initEntityValue } = getInternalHooks(HOOK_MARK);
      initEntityValue(this);
    }
  }

```
这里其实就是调用了initEntityValue这个函数，传入Field组件

```js
 private initEntityValue = (entity: FieldEntity) => {
    const { initialValue } = entity.props;

    if (initialValue !== undefined) {
      const namePath = entity.getNamePath();
      const prevValue = getValue(this.store, namePath);

      if (prevValue === undefined) {
        this.updateStore(setValue(this.store, namePath, initialValue));
      }
    }
  };
```
这里就是简单设置了一下初始值并不会引起Field的rerender，接下来我们继续看Field组件都做了哪些初始化

```js
  public componentDidMount() {
    const {  fieldContext } = this.props;
     //标记为已挂载
    this.mounted = true;

    if (fieldContext) {
      const { getInternalHooks }: InternalFormInstance = fieldContext;
      const { registerField } = getInternalHooks(HOOK_MARK);
      //
      this.cancelRegisterFunc = registerField(this);
    }
  }
```
这里的核心就是registerField，还记得我们之前提到过formStore的fieldEntities数组里存储了Field吗，这个函数其实核心就是fieldEntities.push(field)，然后给我们返回了一个函数用于在fieldEntities里delete这个Field，这样我们就可以通过formInstance调用Field里暴露的一些方法用于更新或者校验。 

然后就是render函数

```js
 public render() {
    const { resetCount } = this.state;
    const { children } = this.props;

    const { child, isFunction } = this.getOnlyChild(children);

    // Not need to `cloneElement` since user can handle this in render function self
    let returnChildNode: React.ReactNode;
    if (isFunction) {
      returnChildNode = child;
    } else if (React.isValidElement(child)) {
      returnChildNode = React.cloneElement(
        child as React.ReactElement,
        this.getControlled((child as React.ReactElement).props),
      );
    } else {
      warning(!child, '`children` of Field is not validate ReactElement.');
      returnChildNode = child;
    }

    return <React.Fragment key={resetCount}>{returnChildNode}</React.Fragment>;
  }
}
```
getonlychild返回第一个child和他的类型，当child是合法的reactElement时，调用[cloneElement方法](https://react.dev/reference/react/cloneElement)，然后返回Fragment包裹的cloneElement，所以这里的关键就是这个cloneElement的第二个参数，这里到底传入了什么东西🤨。  
简单地说，cloneElement的第二个参数其实是`props`，它可以覆盖默认的props，fc-field-form就是在这里接管了Field的onChange等一系列事件，我们来看看getControlled的源码

```js
  public getControlled = (childProps: ChildProps = {}) => {
  //获取Field的一些方法和数据
    const {
      name,
      trigger,
      validateTrigger,
      getValueFromEvent,
      normalize,
      valuePropName,
      getValueProps,
      fieldContext,
    } = this.props;
   //校验有关,其实就是一些事件的name，如'onChange'
    const mergedValidateTrigger =
      validateTrigger !== undefined ? validateTrigger : fieldContext.validateTrigger;
    //当前field name
    const namePath = this.getNamePath();
    const { getInternalHooks, getFieldsValue }: InternalFormInstance = fieldContext;
    //---------- dispatch传入不同的参数可以分发不同操作如校验，更新 ----------------
    const { dispatch } = getInternalHooks(HOOK_MARK);
    const value = this.getValue();
    //不太重要，给子元素提供一个可以获取value的方法
    const mergedGetValueProps = getValueProps || ((val: StoreValue) => ({ [valuePropName]: val }));
    //同上
    const valueProps = name !== undefined ? mergedGetValueProps(value) : {};
        //trigger的默认值是onChange，如果我们在某个Field的input里绑定了onChange事件，这里就可以拿到
    const originTriggerFunc = childProps[trigger];
    // warning when prop value is function
    if (process.env.NODE_ENV !== 'production' && valueProps) {
      Object.keys(valueProps).forEach(key => {
        warning(
          typeof valueProps[key] !== 'function',
          `It's not recommended to generate dynamic function prop by \`getValueProps\`. Please pass it to child component directly (prop: ${key})`,
        );
      });
    }
    //这个control就是我们要返回的props，现在还几乎没有啥真正有用的变化
    const control = {
      ...childProps,
      ...valueProps,
    };
    //------------------------------- 劫持事件了 ------------------------------------
    control[trigger] = (...args: EventArgs) => {
      //修改一些状态
      this.touched = true;
      this.dirty = true;

      this.triggerMetaEvent();

      let newValue: StoreValue;
      //默认为空，用户可以传入，就是获取事件返回值
      if (getValueFromEvent) {
        newValue = getValueFromEvent(...args);
      } else {
      //用户不传入使用默认方法
        newValue = defaultGetValueFromEvent(valuePropName, ...args);
      }
      //对数据进行一些格式化处理
      if (normalize) {
        newValue = normalize(newValue, value, getFieldsValue(true));
      }
       //分发更新事件
      dispatch({
        type: 'updateValue',
        namePath,
        value: newValue,
      });
       //如果用户还绑定了事件，调用用户原来绑定的事件
      if (originTriggerFunc) {
        originTriggerFunc(...args);
      }
    };
    
    //触发校验的数组，如['onChange'],后面的先不看属于校验的内容
     const validateTriggerList: string[] = toArray(mergedValidateTrigger || []);

    validateTriggerList.forEach((triggerName: string) => {
      // Wrap additional function of component, so that we can get latest value from store
      const originTrigger = control[triggerName];
      control[triggerName] = (...args: EventArgs) => {
        if (originTrigger) {
          originTrigger(...args);
        }

        // Always use latest rules
        const { rules } = this.props;
        if (rules && rules.length) {
          // We dispatch validate to root,
          // since it will update related data with other field with same name
          dispatch({
            type: 'validateField',
            namePath,
            triggerName,
          });
        }
      };
    });

    return control;
  };
```
到了这里其实我们已经找到了rc-field-form在表单触发事件时，虽然我们并没有绑定事件，但是它已经将其劫持，并且通过dispatch这个函数通知formStore进行数据上的更新。接下来我们一起来探索data和ui是如何更新。

dispatch这个函数的代码很少，如下
```js
  private dispatch = (action: ReducerAction) => {
    switch (action.type) {
      case 'updateValue': {
        const { namePath, value } = action;
        this.updateValue(namePath, value);
        break;
      }
      case 'validateField': {
        const { namePath, triggerName } = action;
        this.validateFields([namePath], { triggerName });
        break;
      }
      default:
      // Currently we don't have other action. Do nothing.
    }
  };
```
可以看到，我们触发updateVlue进入了updateValue这个函数

```js
  private updateValue = (name: NamePath, value: StoreValue) => {
    const namePath = getNamePath(name);
    const prevStore = this.store;
    this.updateStore(setValue(this.store, namePath, value));

    this.notifyObservers(prevStore, [namePath], {
      type: 'valueUpdate',
      source: 'internal',
    });
    ......
  };
```
 简略后的代码如上，updateStore更新了一下store，其实到这里我们就已经将formInstance的store更新了，接下来思考的是如何更新ui，我们一起来看看这个notifyObservers函数
 
```js
 private notifyObservers = (
    prevStore: Store,
    namePathList: InternalNamePath[] | null,
    info: NotifyInfo,
  ) => {
    if (this.subscribable) {
    //合并info和store
      const mergedInfo: ValuedNotifyInfo = {
        ...info,
        store: this.getFieldsValue(true),
      };
      //获取所有Field，执行每个Field的onStoreChange方法
      this.getFieldEntities().forEach(({ onStoreChange }) => {
        onStoreChange(prevStore, namePathList, mergedInfo);
      });
    } else {
      this.forceRootUpdate();
    }
  };
```
还记得我们提到过Field里的onStoreChange与更新有关吗，没错现在这一切都连了起来。

```js
public onStoreChange: FieldEntity['onStoreChange'] = (prevStore, namePathList, info) => {
  const { shouldUpdate, dependencies = [], onReset } = this.props;
  const { store } = info;
  const namePath = this.getNamePath();
  const prevValue = this.getValue(prevStore);
  const curValue = this.getValue(store);
  //匹配是否包含当前name
  const namePathMatch = namePathList && containsNamePath(namePathList, namePath);

  // 为setFieldValue这样的api服务的
  if (
    info.type === 'valueUpdate' &&
    info.source === 'external' &&
    !isEqual(prevValue, curValue)
  ) {
    this.touched = true;
    this.dirty = true;
    this.validatePromise = null;
    this.errors = EMPTY_ERRORS;
    this.warnings = EMPTY_ERRORS;
    this.triggerMetaEvent();
  }
  //其他代码省略，我们这里是default
  switch (info.type) {
    case 'reset':
    case 'remove':
    case 'setField':
    case 'dependenciesUpdate'
    default:
    //一些是否需要更新的判断
      if (
        namePathMatch ||
        ((!dependencies.length || namePath.length || shouldUpdate) &&
          requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info))
      ) {
      //调用方法更新
        this.reRender();
        return;
      }
      break;
  }

  if (shouldUpdate === true) {
    this.reRender();
  }
  };
```
rerender方法也很简单，就是使用了类组件的forceUpdate强制更新
```js
  public reRender() {
    if (!this.mounted) return;
    this.forceUpdate();
  }
```
到这里，我们已经知道了表单如何进行最基本的更新，这里放一张字节大佬的图

![64652037b3ee4d1184d79e8e105e2429~tplv-k3u1fbpfcp-jj-mark_3024_0_0_0_q75[1].awebp](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a88f033593474fd58c47fa0bc79d781c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1588&h=778&s=46900&e=webp&b=fffefe)
再理一下思路
1. 首先我们在Form组件中创建了formInstance,将初始值和一些callback绑定到了form上，然后通过FieldContext将formInstance下放到每个Field组件里实现了方法和数据的共享
2. 在Field组件中，它会在componentDidMount阶段被注册到formInstance中，然后我们通过cloneElement这个api对传入Field的子组件的事件进行了劫持，当触发某生事件时Field组件调用formInstance的dispath方法开始触发更新
3. dispath根据不同的action type会派发不同的事件，在updateVlue的情况下调用了updateValue方法，这个方法中首先通过updateStore方法对Store中的数据进行了更新，然后调用notifyObserver方法，notifyObserver会遍历所有Field组件，调用他们的onStorechange方法，每个Field组件会判断是否需要更新和更新的类型(如reset,setField),然后据此进行不同的操作，最后更新的方法是refresh()，其实就是调用了类组件的forceUpdate方法  

上面这种更新方式是通过用户的一些行为，我们也可以通过forminstance暴露的一些方法如setFieldsValue对表单进行更新，我们再来看看这是如何做到的

```js
private setFieldsValue = (store: Store) => {
  //防止用户在form组件外使用
  this.warningUnhooked();

  const prevStore = this.store;
  //更新store数据
  if (store) {
    const nextStore = merge(this.store, store);
    this.updateStore(nextStore);
  }
//还是通过notifyObservers触发所有Field的onStorechange
  this.notifyObservers(prevStore, null, {
    type: 'valueUpdate',
    source: 'external',
  });
  ......
};
```
最后走到onStorechange的代码

```js
case 'setField': {
  const { data } = info;
  if (namePathMatch) {
    if ('touched' in data) {
      this.touched = data.touched;
    }
    if ('validating' in data && !('originRCField' in data)) {
      this.validatePromise = data.validating ? Promise.resolve([]) : null;
    }
    if ('errors' in data) {
      this.errors = data.errors || EMPTY_ERRORS;
    }
    if ('warnings' in data) {
      this.warnings = data.warnings || EMPTY_ERRORS;
    }
    this.dirty = true;

    this.triggerMetaEvent();

    this.reRender();
    return;
  } else if ('value' in data && containsNamePath(namePathList, namePath, true)) {
          // Contains path with value should also check
    this.reRender();
    return;
  }
```
只是多了一些数据的处理，其他代码都差不多，到这里form的更新大概就聊完了，接下来我们来说说表单校验是如何实现的。
# 二·如何实现校验
### 如何触发校验
想要知道校验的实现，我们还是得先看看有哪些方法可以触发form表单的校验，首先是formInstance的submit

```js
private submit = () => {
  this.warningUnhooked();
//这个就是校验相关的函数
  this.validateFields()
    .then(values => {
      const { onFinish } = this.callbacks;
      if (onFinish) {
        try {
          onFinish(values);
        } catch (err) {
          // Should print error if user `onFinish` callback failed
          console.error(err);
        }
      }
    })
    .catch(e => {
      const { onFinishFailed } = this.callbacks;
      if (onFinishFailed) {
        onFinishFailed(e);
      }
    });
};
}
```
还有当一些用户行为触发的事件如onChange，其实这也是在getControlled里帮我们劫持了

```js

  ...
  //触发校验的event name数组
 const validateTriggerList: string[] = toArray(mergedValidateTrigger || []);

 validateTriggerList.forEach((triggerName: string) => {
   // Wrap additional function of component, so that we can get latest value from store
   const originTrigger = control[triggerName];
   //劫持并添加校验逻辑
   control[triggerName] = (...args: EventArgs) => {
     if (originTrigger) {
       originTrigger(...args);
     }

     // 如果存在rules就dispatch派发校验
     const { rules } = this.props;
     if (rules && rules.length) {
       // We dispatch validate to root,
       // since it will update related data with other field with same name
       dispatch({
         type: 'validateField',
         namePath,
         triggerName,
       });
     }
```
这里的dispatch也会触发formInstance的validateFields方法，下面我们就把注意力放到这个函数中
### 校验的实现

```js
private validateFields: InternalValidateFields = (arg1?: any, arg2?: any) => {
  this.warningUnhooked();

  let nameList: NamePath[];
  let options: InternalValidateOptions;
  //对不同形式传入参数的一些处理
  if (Array.isArray(arg1) || typeof arg1 === 'string' || typeof arg2 === 'string') {
    nameList = arg1;
    options = arg2;
  } else {
    options = arg1;
  }
  //获取传入的Field name
  const provideNameList = !!nameList;
  const namePathList: InternalNamePath[] | undefined = provideNameList
    ? nameList.map(getNamePath)
    : [];

  // 用来收集后续的校验
  const promiseList: Promise<FieldError>[] = [];

  //遍历每个Field判断是否需要校验
  this.getFieldEntities(true).forEach((field: FieldEntity) => {
    // 如果没有传入namelist就把所有Field加入namePathList中
    if (!provideNameList) {
      namePathList.push(field.getNamePath());
    }

    // 如果没有配置rule就不需要后续操作
    if (!field.props.rules || !field.props.rules.length) {
      return;
    }

    const fieldNamePath = field.getNamePath();
 

    //调用Field的校验方法，保存该方法的Promise
    if (!provideNameList || containsNamePath(namePathList, fieldNamePath, recursive)) {
      const promise = field.validateRules({
        validateMessages: {
          ...defaultValidateMessages,
          ...this.validateMessages,
        },
        ...options,
      });

      // 将保存的Promise推入之前创建的promiseList中
      promiseList.push(
        promise
          .then<any, RuleError>(() => ({ name: fieldNamePath, errors: [], warnings: [] }))
          .catch((ruleErrors: RuleError[]) => {
          //保留错误和warnings
            const mergedErrors: string[] = [];
            const mergedWarnings: string[] = [];
            //根据传入的不同配置对错误进行不同处理         
            ruleErrors.forEach?.(({ rule: { warningOnly }, errors }) => {
              if (warningOnly) {
                mergedWarnings.push(...errors);
              } else {
                mergedErrors.push(...errors);
              }
            });
             //根据是否有错误返回不同结果
            if (mergedErrors.length) {
              return Promise.reject({
                name: fieldNamePath,
                errors: mergedErrors,
                warnings: mergedWarnings,
              });
            }

            return {
              name: fieldNamePath,
              errors: mergedErrors,
              warnings: mergedWarnings,
            };
          }),
      );
      }
  });
   //收集所有检验项的结果
  const summaryPromise = allPromiseFinish(promiseList);
    //将这次校验的结果保存在formInstance中
  this.lastValidatePromise = summaryPromise;

  // Notify fields with rule that validate has finished and need update
  summaryPromise
    .catch(results => results)
    .then((results: FieldError[]) => {
      const resultNamePathList: InternalNamePath[] = results.map(({ name }) => name);
      //通知Field进行更新
      this.notifyObservers(this.store, resultNamePathList, {
        type: 'validateFinish',
      });
      this.triggerOnFieldsChange(resultNamePathList, results);
    });
    //这个Promise将会被作为返回值，在submit的时候会起到作用
  const returnPromise: Promise<Store | ValidateErrorEntity | string[]> = summaryPromise
    .then((): Promise<Store | string[]> => {
    //如果没有规则错误就直接返回所有校验项的值
      if (this.lastValidatePromise === summaryPromise) {
        return Promise.resolve(this.getFieldsValue(namePathList));
      }
      return Promise.reject<string[]>([]);
    })
    .catch((results: { name: InternalNamePath; errors: string[] }[]) => {
    //存在错误将错误整理返回
      const errorList = results.filter(result => result && result.errors.length);
      return Promise.reject({
        values: this.getFieldsValue(namePathList),
        errorFields: errorList,
        outOfDate: this.lastValidatePromise !== summaryPromise,
      });
    });

  // Do not throw in console
  returnPromise.catch<ValidateErrorEntity>(e => e);

  return returnPromise as Promise<Store>;
  };
```
这里的代码比较长，我们来整理一下关键的地方：如果传入了nameList那么会对nameList对应的Field进行校验，否则就会全部校验，当然他们需要传入了rules，而这里的校验方法其实是调用的Field组件的validateRules方法，这个函数我们后续会分析，然后我们会把validateRules返回的promise收集到promiseList中，通过allPromiseFinish函数，我们就可以拿到校验结果的数组了，接下来主要就是2件事，一是通知对应的Field进行更新，二是根据校验结果返回Promise作为 onFinishFailed和onFinish的触发依据，这里的逻辑也比较简单。所以下面我们就来看看Field组件中的validateRules方法

```js
public validateRules = (options?: InternalValidateOptions): Promise<RuleError[]> => {

  const namePath = this.getNamePath();
  const currentValue = this.getValue();

  const { triggerName, validateOnly = false } = options || {};
  
  const rootPromise = Promise.resolve().then(async (): Promise<any[]> => {
    if (!this.mounted) {
      return [];
    }

    const { validateFirst = false, messageVariables, validateDebounce } = this.props;

    // 对rule的一些过滤，这里主要是排除空校验和触发时机不满足的
    let filteredRules = this.getRules();
    if (triggerName) {
      filteredRules = filteredRules
        .filter(rule => rule)
        .filter((rule: RuleObject) => {
          const { validateTrigger } = rule;
          if (!validateTrigger) {
            return true;
          }
          const triggerList = toArray(validateTrigger);
          return triggerList.includes(triggerName);
        });
    }
    
     ......
     
    //其实这个promise就是包含了当前检验结果的promise
    const promise = validateRules(
      namePath,
      currentValue,
      filteredRules,
      options,
      validateFirst,
      messageVariables,
    );

    promise
      .catch(e => e)
      .then((ruleErrors: RuleError[] = EMPTY_ERRORS) => {
        if (this.validatePromise === rootPromise) {
          this.validatePromise = null;

          //根据option处理数据跟前面相似
          const nextErrors: string[] = [];
          const nextWarnings: string[] = [];
          ruleErrors.forEach?.(({ rule: { warningOnly }, errors = EMPTY_ERRORS }) => {
            if (warningOnly) {
              nextWarnings.push(...errors);
            } else {
              nextErrors.push(...errors);
            }
          });
           把结果存储在当前Field上
          this.errors = nextErrors;
          this.warnings = nextWarnings;
          this.triggerMetaEvent();
          this.reRender();
        }
      });

    return promise;
  });

  if (validateOnly) {
    return rootPromise;
  }
  //一些数据的更新
  this.validatePromise = rootPromise;
  this.dirty = true;
  this.errors = EMPTY_ERRORS;
  this.warnings = EMPTY_ERRORS;
  this.triggerMetaEvent();

  // Force trigger re-render since we need sync renderProps with new meta
  this.reRender();
  //可以看到正常流程下其实就是返回的validateRules(...args)的promise结果
  return rootPromise;
  };
```
所以这里的大部分代码还是在进行流程的串联和Field内部状态的一些处理，校验相关的还是也并非在这里实现，其实rc-field-form的表单校验依赖了rc-component/async-validator，然后对其进行了一些封装，这里也不做过多介绍了。
# 三 一些其他功能
上面聊完了form的核心功能，下面我们再来看一看一些比较好用的特性.
首先是list组件，这里我放一个[antd的例子](https://ant.design/components/form-cn#components-form-demo-dynamic-form-item)，不熟悉的可以去了解一下效果。
### List

```js
 <List name='xxx'>
 {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
                <Field
                  {...field}
                >
                  <Input placeholder="passenger name"/>
                </Field>
            ))}
          </>
        )}
      </List>
```
大概的使用方法如上，我们需要给List组件传入一个函数，然后在这个函数里通过组件给我们的fields参数进行遍历渲染出每个Field，同时他也给我们提供了一些方法对数据进行操控，下面我们一起来看看如何实现。先贴出这个组件的代码，然后我们来慢慢分析。

```js
function List<Values = any>({
  name,
  initialValue,
  children,
  rules,
  validateTrigger,
  isListField,
}: ListProps<Values>) {
//存放了formInstance和validateTrigger
  const context = React.useContext(FieldContext);
  //现在这里还没有东西
  const wrapperListContext = React.useContext(ListContext);
  const keyRef = React.useRef({
    keys: [],
    id: 0,
  });
  const keyManager = keyRef.current;
  //获取当前的Fieldname
  const prefixName: InternalNamePath = React.useMemo(() => {
    const parentPrefixName = getNamePath(context.prefixName) || [];
    return [...parentPrefixName, ...getNamePath(name)];
  }, [context.prefixName, name]);
  //创建context传递firminstance和name
  const fieldContext = React.useMemo(() => ({ ...context, prefixName }), [context, prefixName]);

  // 创建list的context
  const listContext = React.useMemo<ListContextProps>(
    () => ({
      getKey: (namePath: InternalNamePath) => {
        const len = prefixName.length;
        const pathName = namePath[len];
        return [keyManager.keys[pathName], namePath.slice(len + 1)];
      },
    }),
    [prefixName],
  );
  // list组件的children只能传入函数
  if (typeof children !== 'function') {
    warning(false, 'Form.List only accepts function as children.');
    return null;
  }
 //辅助更新
  const shouldUpdate = (prevValue: StoreValue, nextValue: StoreValue, { source }) => {
    if (source === 'internal') {
      return false;
    }
    return prevValue !== nextValue;
  };
 
  return (
    <ListContext.Provider value={listContext}>
      <FieldContext.Provider value={fieldContext}>
        <Field
          name={[]}
          shouldUpdate={shouldUpdate}
          rules={rules}
          validateTrigger={validateTrigger}
          initialValue={initialValue}
          isList
          isListField={isListField ?? !!wrapperListContext}
        >
         .........
         
        </Field>
      </FieldContext.Provider>
    </ListContext.Provider>
  );
}
```
看到这里其实我们能够发现，list组件其实还是根据Field组件进行的封装，现在我们再来看看Field组件里都有什么东西

```js
{({ value = [], onChange }, meta) => {
  const { getFieldValue } = context;
  //获取当前Filed维护的值
  const getNewValue = () => {
      const values = getFieldValue(prefixName || []) as StoreValue[];
      return values || [];
 };
    const operations: ListOperations = {
      add: (defaultValue, index?: number) => {
         // Mapping keys
        const newValue = getNewValue();
        console.log(newValue,defaultValue)
         if (index >= 0 && index <= newValue.length) {
          keyManager.keys = [
             ...keyManager.keys.slice(0, index),
            keyManager.id,
             ...keyManager.keys.slice(index),
          ];
          onChange([...newValue.slice(0, index), defaultValue, ...newValue.slice(index)]);
         } else {
          if (
             process.env.NODE_ENV !== 'production' &&
            (index < 0 || index > newValue.length)
           ) {
             warning(
                false,
               'The second parameter of the add function should be a valid positivenumber.',
             );
           }
           keyManager.keys = [...keyManager.keys, keyManager.id];
           console.log(keyManager)
           onChange([...newValue, defaultValue]);
        }
         keyManager.id += 1;
      }，

     let listValue = value || [];
     if (!Array.isArray(listValue)) {
      listValue = [];

       if (process.env.NODE_ENV !== 'production') {
         warning(
           false,
           `Current value of '${prefixName.join(' > ')}' is not an array type.`,
         );
       }
     }

    return children(
      (listValue as StoreValue[]).map((__, index): ListField => {
        let key = keyManager.keys[index];
        if (key === undefined) {
         keyManager.keys[index] = keyManager.id;
            key = keyManager.keys[index];
            keyManager.id += 1;
          }

         return {
           name: index,
           key,
           isListField: true,
         };
       }),
       operations,
       meta,
     );
    }}
```
 首先我们注意到，Field组件里我们传入的也是一个函数，这里需要先带大家复习一下，在Field组件中，如果我们传入的child是一个函数，那么会传入getControlled(), meta,fieldContext这3个参数(相关函数getOnlyChild )，并将函数的返回值作为最终的child,meta其实就是Field的一些状态，接下来来看看operations

```js
   const operations: ListOperations = {
      add: (defaultValue, index?: number) => {
         // 其实这里获取的就是当前的值
        const newValue = getNewValue();
        如果传入了index并且index没有超出当前index就插入
         if (index >= 0 && index <= newValue.length) {
          keyManager.keys = [
             ...keyManager.keys.slice(0, index),
            keyManager.id,
             ...keyManager.keys.slice(index),
          ];
          //一个onChange方法，传入了新值
          onChange([...newValue.slice(0, index), defaultValue, ...newValue.slice(index)]);
         } else {
          if (
             process.env.NODE_ENV !== 'production' &&
            (index < 0 || index > newValue.length)
           ) {
           //一些错误处理
             warning(
                false,
               'The second parameter of the add function should be a valid positivenumber.',
             );
           }
           //否者默认将值更新到最后
           keyManager.keys = [...keyManager.keys, keyManager.id];
           onChange([...newValue, defaultValue]);
        }
         keyManager.id += 1;
      }，
```
其实这一部分就是维护了一个对象，提供了之前add等一些修改数据的方法，其他方法这里省略了。

```js
 let listValue = value || [];
 if (!Array.isArray(listValue)) {
   listValue = [];

   if (process.env.NODE_ENV !== 'production') {
      warning(false,`Current value of '${prefixName.join(' > ')}' is not an array type.`);
    }
 }
```
这里也很简单，对listvalue进行了一些判断，接下来是最后的一部分

```js
     return children(
       (listValue as StoreValue[]).map((__, index): ListField => {
         let key = keyManager.keys[index];
         if (key === undefined) {
           keyManager.keys[index] = keyManager.id;
           key = keyManager.keys[index];
           keyManager.id += 1;
         }

         return {
           name: index,
           key,
           isListField: true,
         };
       }),
       operations,
       meta,
     );
```
这里的children是什么呢，其实这里的children就是我们在List组件里传入的函数，这样的话就很明显了List组件帮其实就是帮我们进行了数据管理，并将操作数据的方法暴露给我们，我们再来看看最开始我们是如何使用List组件的

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d444717d4fbd4ef093f83dd6caf141e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=362&s=28328&e=png&b=f8f8f8)
这里传递的filed属性其实就把这样的属性传递给了Field。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a829367ec294c9b95363a2581ac74f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=340&h=87&s=18232&e=png&b=202021)  
接着我们再来看看List组件为什么能够做到对子数据的统一管理呢。  
 举个简单的例子，比如我们维护了一个users的Field数组，那么他的数据结构大概是 *users:['xiaomin','xiaozhang']*,当我们通过list组件暴露出来的方法对数据进行修改时因为list组件是基于Field的封装，所以这些修改会触发onStoreChange让list组件rerender，而其中的子Field自然也会重新渲染，那么子Field是如何获取正确的值呢，看上面那张图，我们给子组件传递了一个key，在getControlled的时候，Field会调用getValue方法获取值，其实这个getValue函数就类似与lodash中的get方法，而如果一个Field是listField的话，那么当我们获取namePath时其实一种 [parentName,key] 的形式

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98f7336c717643948c80631320734068~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=143&h=42&s=1501&e=png&b=fffefe)
所以我们就可以根据这个获取新值达到更新的效果，这里还有一点，某个子Field的更新其实是不会影响到List组件的。
### dependence
最后我们再来聊一聊另一个功能，dependence.这里还是给出一个[antd的例子](https://ant.design/components/form-cn#components-form-demo-form-dependencies)，简单的说，就是我们可以给某个Flied配置dependence字段，当dependence数组中包含的Field触发了更新，这个Field也会同步触发更新。 下面是rc-field-form官方demo，大家可以自己试一下。当name为1时可以看到password渲染，然后password如果不为空则password2渲染 ，**后来在写文章的时候感觉这个例子是有问题的，我们一会再分析**

```js
import Form, { Field } from 'rc-field-form';
import React from 'react';
import Input from './components/Input';

type FormData = {
  name?: string;
  password?: string;
  password2?: string;
};

export default () => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      preserve={false}
      onFieldsChange={fields => {
        console.error('fields:', fields);
      }}
    >
      <Field<FormData> name="name">
        <Input placeholder="Username" />
      </Field>

      <Field<FormData> dependencies={['name']}>
        {() => {
          return form.getFieldValue('name') === '1' ? (
            <Field name="password">
              <Input placeholder="Password" />
            </Field>
          ) : null;
        }}
      </Field>

      <Field dependencies={['password']}>
        {() => {
          const password = form.getFieldValue('password');
          console.log('>>>', password);
          return password ? (
            <Field<FormData> name={['password2']}>
              <Input placeholder="Password 2" />
            </Field>
          ) : null;
        }}
      </Field>

      <button onClick={()=} type="submit">Submit</button>
    </Form>
  );
};
```
这里我们直接来讲他是如何实现的,我看了一下源码然后写demo测试后发现在rc-field-form里如果我们通过如setFieldValue这样的api是无法触发dependence更新的，这里我们就只聊通过onChange等行为触发的更新。

```js
  private updateValue = (name: NamePath, value: StoreValue) => {
  
   ......

    const childrenFields = this.triggerDependenciesUpdate(prevStore, namePath);
   ......
  };
```
可以看到具体的逻辑是由**updateValue**开始的，我们先来看看**triggerDependenciesUpdate**干了啥

```js
  private triggerDependenciesUpdate = (prevStore: Store, namePath: InternalNamePath) => {
  //这个函数等会讲，其实就是拿到依赖于当前字段的Field
    const childrenFields = this.getDependencyChildrenFields(namePath);
    //对依赖于当前字段的Field进行校验
    if (childrenFields.length) {
      this.validateFields(childrenFields);
    }
    //通知更新
    this.notifyObservers(prevStore, childrenFields, {
      type: 'dependenciesUpdate',
      relatedFields: [namePath, ...childrenFields],
    });

    return childrenFields;
  };

```
接下来我们看看**getDependencyChildrenFields**这个方法，

```js
  private getDependencyChildrenFields = (rootNamePath: InternalNamePath): InternalNamePath[] => {   
    const children: Set<FieldEntity> = new Set();
    //返回值，这个是被打平的denpendence
    const childrenFields: InternalNamePath[] = [];
    //用于存储依赖的map
    const dependencies2fields: NameMap<Set<FieldEntity>> = new NameMap();
    
    ........
    
    return childrenFields;
  };
```
接下来我们来看看具体的处理，首先是构建依赖map

```js
    this.getFieldEntities().forEach(field => {
      console.log(field.props.dependencies)
      const { dependencies } = field.props;
      (dependencies || []).forEach(dependency => {
        const dependencyNamePath = getNamePath(dependency);
        dependencies2fields.update(dependencyNamePath, (fields = new Set()) => {
          fields.add(field);
          return fields;
        });
      });
    });
```
举个例子，如果C和D依赖B，B依赖A，这样就会创建出这样的map来，我们为什么需要这样的操作呢，其实我们可以想一下，在这个例子中，虽然C，D的dependence是B，但是B同时也依赖于A，那么如果A触发了更新，C和D也应该更新，所以**getDependencyChildrenFields**就是为了解决这种循环依赖，现在我们已经有了dependenceMap，接下来就需要通过这个map获取所有的依赖

```js
{
    A: [FieldB],
    B: [FieldC，FieldD]
}

```

```js
    const fillChildren = (namePath: InternalNamePath) => {
      //获取直接依赖于它的Field
      const fields = dependencies2fields.get(namePath) || new Set();
      //查看是否有Field间接依赖
      fields.forEach(field => {
      //只判断未判断过的
        if (!children.has(field)) {
          children.add(field);

          const fieldNamePath = field.getNamePath();
          if (fieldNamePath.length) {
            childrenFields.push(fieldNamePath);
            fillChildren(fieldNamePath);
          }
        }
      });
    };

    fillChildren(rootNamePath);
```
这样我们就可以拿到所有依赖的Field了，我们继续回到更新的流程。

```js
    this.notifyObservers(prevStore, childrenFields, {
      type: 'dependenciesUpdate',
      relatedFields: [namePath, ...childrenFields],
    });
```
这里已经很熟悉了，通过notifyObserver调用所有Field的onStoreChange，我们直接看在onStoreChange里进行了哪些操作

```js

      case 'dependenciesUpdate': {
        //获取当前Field的dependence
        const dependencyList = dependencies.map(getNamePath);
        //如果某个依赖被包含在relatedFields中就触发更新
        if (dependencyList.some(dependency => containsNamePath(info.relatedFields, dependency))) {
          this.reRender();
          return;
        }
        break;
      }
```
其实这里也比较简单，所以dependence的流程我们也分析完了。  
最后就是说说刚才我提到了官方的demo有问题，下面就来谈谈为什么有问题。还是先放一下代码

```js
```js
import Form, { Field } from 'rc-field-form';
import React from 'react';
import Input from './components/Input';

type FormData = {
  name?: string;
  password?: string;
  password2?: string;
};

export default () => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      preserve={false}
      onFieldsChange={fields => {
        console.error('fields:', fields);
      }}
    >
      <Field<FormData> name="name">
        <Input placeholder="Username" />
      </Field>

      <Field<FormData> dependencies={['name']}>
        {() => {
          return form.getFieldValue('name') === '1' ? (
            <Field name="password">
              <Input placeholder="Password" />
            </Field>
          ) : null;
        }}
      </Field>

      <Field dependencies={['password']}>
        {() => {
          const password = form.getFieldValue('password');
          console.log('>>>', password);
          return password ? (
            <Field<FormData> name={['password2']}>
              <Input placeholder="Password 2" />
            </Field>
          ) : null;
        }}
      </Field>

      <button onClick={()=} type="submit">Submit</button>
    </Form>
  );
};
```
首先，我们可以看到在官方demo中每个配置了dependence的Filed字段其实是没有配置name的，但是当我们构建childrenFields时是需要获取Field的name的，这就导致了获取childrenFields其实是获取了一个空数组，这样看来，如果当前name=1,password存在value，然后我们改变name的值，password和password1都不会隐藏，但是我们可以发现这个demo运行起来其实是没有问题的，这是为什么呢。  
关键在这里：

```js
    this.notifyObservers(prevStore, childrenFields, {
      type: 'dependenciesUpdate',
      relatedFields: [namePath, ...childrenFields],
    });
```
我们在触发dependence更新的时候在relatedFields中还把触发更新的Field name传递了过去，这里也就是'name',所以当我们触发所有组件的onStoreChange，password是能够更新的，那password1又是如何正确更新的呢？

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81e16c73048f4503b22dc41a989bde02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=828&h=262&s=141570&e=png&b=222023)
还记得这个方法吗，password这个Field在卸载的时候会执行这个方法，这个方法其实就是registerField的返回函数，而这个返回函数里又调用了`this.triggerDependenciesUpdate(prevStore, namePath);`，后面的流程就跟上面相似了。  
# 完结撒花
写了这么多终于把rc-field-form的一些主要流程讲完了🧐，第一次写文章写的真挺烂的，最后还是大家推荐一些关于rc-field-form的文章： 
- [一次手写Antd Form的经历，让我受益匪浅 - 掘金 (juejin.cn)](https://juejin.cn/post/7038099720400535582)
- [手写一个 Antd4 Form 吧（上篇）：源码分析 - 掘金 (juejin.cn)](https://juejin.cn/post/7116390485710602254)
- [🍓中台表单技术选型实践(表单实践) - 掘金 (juejin.cn)](https://juejin.cn/post/7316723621292638246)