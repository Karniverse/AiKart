
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* IntroCard.svelte generated by Svelte v3.29.4 */

    const file = "IntroCard.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "title svelte-1we3r7c");
    			add_location(div0, file, 10, 8, 378);
    			attr_dev(div1, "class", "description svelte-1we3r7c");
    			add_location(div1, file, 11, 8, 420);
    			attr_dev(div2, "class", "content svelte-1we3r7c");
    			add_location(div2, file, 9, 4, 347);
    			attr_dev(div3, "class", "card svelte-1we3r7c");
    			add_location(div3, file, 7, 0, 260);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			div1.innerHTML = /*description*/ ctx[1];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*description*/ 2) div1.innerHTML = /*description*/ ctx[1];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("IntroCard", slots, []);
    	let { title = "AiKart" } = $$props;
    	let { description = "I'm KarMukil, this page exclusively showcases my AI art.<br>All wallpapers are free to download" } = $$props;
    	const writable_props = ["title", "description"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IntroCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    	};

    	$$self.$capture_state = () => ({ title, description });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, description];
    }

    class IntroCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { title: 0, description: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IntroCard",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get title() {
    		throw new Error("<IntroCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IntroCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<IntroCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<IntroCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* Gallery.svelte generated by Svelte v3.29.4 */

    const { console: console_1 } = globals;
    const file$1 = "Gallery.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (109:4) {#each imageEntries as image}
    function create_each_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[10](/*image*/ ctx[17], ...args);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[17].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Gallery Image");
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "svelte-imghby");
    			add_location(img, file$1, 109, 8, 3674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*imageEntries*/ 1 && img.src !== (img_src_value = /*image*/ ctx[17].thumb)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(109:4) {#each imageEntries as image}",
    		ctx
    	});

    	return block;
    }

    // (120:0) {#if selectedImage}
    function create_if_block(ctx) {
    	let div1;
    	let button0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let button1;
    	let t4;
    	let div0;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*imageEntries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "❮";
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "❯";
    			t4 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button0, "class", "prev svelte-imghby");
    			add_location(button0, file$1, 127, 8, 4108);
    			if (img.src !== (img_src_value = /*selectedImage*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Full Image");
    			attr_dev(img, "class", "svelte-imghby");
    			add_location(img, file$1, 128, 8, 4177);
    			attr_dev(button1, "class", "next svelte-imghby");
    			add_location(button1, file$1, 129, 8, 4231);
    			attr_dev(div0, "class", "thumbnails svelte-imghby");
    			add_location(div0, file$1, 132, 8, 4341);
    			attr_dev(div1, "class", "lightbox svelte-imghby");
    			add_location(div1, file$1, 120, 4, 3922);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(div1, t1);
    			append_dev(div1, img);
    			append_dev(div1, t2);
    			append_dev(div1, button1);
    			append_dev(div1, t4);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*prevImage*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*nextImage*/ ctx[4], false, false, false),
    					listen_dev(div1, "click", /*closeLightbox*/ ctx[3], false, false, false),
    					listen_dev(div1, "touchstart", /*handleTouchStart*/ ctx[7], false, false, false),
    					listen_dev(div1, "touchend", /*handleTouchEnd*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*selectedImage*/ 2 && img.src !== (img_src_value = /*selectedImage*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*imageEntries, selectImage*/ 65) {
    				each_value = /*imageEntries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(120:0) {#if selectedImage}",
    		ctx
    	});

    	return block;
    }

    // (134:12) {#each imageEntries as thumb}
    function create_each_block(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[11](/*thumb*/ ctx[14], ...args);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*thumb*/ ctx[14].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-imghby");
    			add_location(img, file$1, 134, 16, 4426);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*imageEntries*/ 1 && img.src !== (img_src_value = /*thumb*/ ctx[14].thumb)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(134:12) {#each imageEntries as thumb}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*imageEntries*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*selectedImage*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "gallery svelte-imghby");
    			add_location(div, file$1, 107, 0, 3608);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleKeyDown*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageEntries, openLightbox*/ 5) {
    				each_value_1 = /*imageEntries*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*selectedImage*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*selectedImage*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Gallery", slots, []);
    	let { imageEntries = [] } = $$props; // Array of objects: { thumb, full, date }
    	let selectedImage = null;
    	let startX = 0; // For swipe gestures

    	// Open lightbox with the full-size image.
    	function openLightbox(fullImage) {
    		$$invalidate(1, selectedImage = fullImage);
    	}

    	// Close lightbox only if clicking on the background.
    	function closeLightbox(event) {
    		if (event.target.classList.contains("lightbox")) {
    			$$invalidate(1, selectedImage = null);
    		}
    	}

    	// Go to next image. If called from a keyboard event, event may be undefined.
    	function nextImage(event) {
    		if (event) event.stopPropagation();
    		let index = imageEntries.findIndex(img => img.full === selectedImage);

    		if (index < imageEntries.length - 1) {
    			$$invalidate(1, selectedImage = imageEntries[index + 1].full);
    		}
    	}

    	// Go to previous image.
    	function prevImage(event) {
    		if (event) event.stopPropagation();
    		let index = imageEntries.findIndex(img => img.full === selectedImage);

    		if (index > 0) {
    			$$invalidate(1, selectedImage = imageEntries[index - 1].full);
    		}
    	}

    	// Select a specific image (from thumbnail navigation).
    	function selectImage(event, fullImage) {
    		event.stopPropagation();
    		$$invalidate(1, selectedImage = fullImage);
    	}

    	// For swipe gestures.
    	function handleTouchStart(event) {
    		startX = event.touches[0].clientX;
    	}

    	function handleTouchEnd(event) {
    		let endX = event.changedTouches[0].clientX;

    		if (startX - endX > 50) {
    			nextImage(event);
    		} else if (endX - startX > 50) {
    			prevImage(event);
    		}
    	}

    	// Handle arrow keys and Esc key.
    	function handleKeyDown(event) {
    		if (!selectedImage) return; // Only act if lightbox is open.

    		if (event.key === "ArrowRight") {
    			nextImage();
    		} else if (event.key === "ArrowLeft") {
    			prevImage();
    		} else if (event.key === "Escape") {
    			$$invalidate(1, selectedImage = null);
    		}
    	}

    	// Fetch images from the server.
    	async function fetchImages() {
    		try {
    			const response = await fetch("https://karmukil.tunnelagent.com/AiKart/");
    			const html = await response.text();
    			const imageEntriesData = [];
    			const regex = /<a href="([^"]+\.(jpg|png|gif|jpeg|webp))">.*?<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})/gi;
    			let match;

    			while ((match = regex.exec(html)) !== null) {
    				const fileName = match[1];
    				const fileDate = match[3];
    				const dateObj = new Date(fileDate.replace(/-/g, " "));

    				imageEntriesData.push({
    					thumb: `https://karmukil.tunnelagent.com/AiKart/th/${fileName}`,
    					full: `https://karmukil.tunnelagent.com/AiKart/${fileName}`,
    					date: dateObj
    				});
    			}

    			// Sort images by date (newest first).
    			imageEntriesData.sort((a, b) => b.date - a.date);

    			$$invalidate(0, imageEntries = [...imageEntriesData]); // Update the reactive variable.
    		} catch(error) {
    			console.error("Error fetching images:", error);
    		}
    	}

    	fetchImages();
    	const writable_props = ["imageEntries"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	const click_handler = image => openLightbox(image.full);
    	const click_handler_1 = (thumb, event) => selectImage(event, thumb.full);

    	$$self.$$set = $$props => {
    		if ("imageEntries" in $$props) $$invalidate(0, imageEntries = $$props.imageEntries);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		imageEntries,
    		selectedImage,
    		startX,
    		openLightbox,
    		closeLightbox,
    		nextImage,
    		prevImage,
    		selectImage,
    		handleTouchStart,
    		handleTouchEnd,
    		handleKeyDown,
    		fetchImages
    	});

    	$$self.$inject_state = $$props => {
    		if ("imageEntries" in $$props) $$invalidate(0, imageEntries = $$props.imageEntries);
    		if ("selectedImage" in $$props) $$invalidate(1, selectedImage = $$props.selectedImage);
    		if ("startX" in $$props) startX = $$props.startX;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		imageEntries,
    		selectedImage,
    		openLightbox,
    		closeLightbox,
    		nextImage,
    		prevImage,
    		selectImage,
    		handleTouchStart,
    		handleTouchEnd,
    		handleKeyDown,
    		click_handler,
    		click_handler_1
    	];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { imageEntries: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get imageEntries() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageEntries(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* SearchBox.svelte generated by Svelte v3.29.4 */

    const file$2 = "SearchBox.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let input;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "searchBox");
    			attr_dev(input, "placeholder", "Search images...");
    			attr_dev(input, "onkeyup", "filterImages()");
    			attr_dev(input, "class", "svelte-1yigw7f");
    			add_location(input, file$2, 21, 4, 669);
    			attr_dev(div, "class", "search svelte-1yigw7f");
    			add_location(div, file$2, 20, 0, 643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SearchBox", slots, []);

    	document.addEventListener("DOMContentLoaded", function () {
    		function filterImages() {
    			let input = document.getElementById("searchBox").value.toLowerCase();
    			let images = document.querySelectorAll(".gallery img");

    			images.forEach(img => {
    				let filename = img.src.toLowerCase();
    				img.style.display = filename.includes(input) ? "block" : "none";
    			});
    		}

    		document.getElementById("searchBox").addEventListener("keyup", filterImages);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SearchBox> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SearchBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchBox",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* TEMP\test.svelte generated by Svelte v3.29.4 */

    const { console: console_1$1 } = globals;
    const file$3 = "TEMP\\test.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (109:4) {#each imageEntries as image}
    function create_each_block_1$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let a;
    	let t1;
    	let a_href_value;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[11](/*image*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			a = element("a");
    			t1 = text("⭳");
    			t2 = space();
    			if (img.src !== (img_src_value = /*image*/ ctx[18].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Gallery Image");
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "svelte-vvff7p");
    			add_location(img, file$3, 110, 12, 3717);
    			attr_dev(a, "class", "download-button svelte-vvff7p");
    			attr_dev(a, "href", a_href_value = /*image*/ ctx[18].full);
    			attr_dev(a, "download", "");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "title", "Download Full Image");
    			add_location(a, file$3, 116, 12, 3914);
    			attr_dev(div, "class", "thumb-container svelte-vvff7p");
    			add_location(div, file$3, 109, 8, 3674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, a);
    			append_dev(a, t1);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "click", click_handler_1, false, false, false),
    					listen_dev(a, "click", stop_propagation(/*click_handler*/ ctx[10]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*imageEntries*/ 1 && img.src !== (img_src_value = /*image*/ ctx[18].thumb)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*imageEntries*/ 1 && a_href_value !== (a_href_value = /*image*/ ctx[18].full)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(109:4) {#each imageEntries as image}",
    		ctx
    	});

    	return block;
    }

    // (130:0) {#if selectedImage}
    function create_if_block$1(ctx) {
    	let div1;
    	let button0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let button1;
    	let t4;
    	let div0;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*imageEntries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "❮";
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "❯";
    			t4 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button0, "class", "prev svelte-vvff7p");
    			add_location(button0, file$3, 137, 8, 4445);
    			if (img.src !== (img_src_value = /*selectedImage*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Full Image");
    			attr_dev(img, "class", "svelte-vvff7p");
    			add_location(img, file$3, 138, 8, 4514);
    			attr_dev(button1, "class", "next svelte-vvff7p");
    			add_location(button1, file$3, 139, 8, 4568);
    			attr_dev(div0, "class", "thumbnails svelte-vvff7p");
    			add_location(div0, file$3, 142, 8, 4678);
    			attr_dev(div1, "class", "lightbox svelte-vvff7p");
    			add_location(div1, file$3, 130, 4, 4259);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(div1, t1);
    			append_dev(div1, img);
    			append_dev(div1, t2);
    			append_dev(div1, button1);
    			append_dev(div1, t4);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*prevImage*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*nextImage*/ ctx[4], false, false, false),
    					listen_dev(div1, "click", /*closeLightbox*/ ctx[3], false, false, false),
    					listen_dev(div1, "touchstart", /*handleTouchStart*/ ctx[7], false, false, false),
    					listen_dev(div1, "touchend", /*handleTouchEnd*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*selectedImage*/ 2 && img.src !== (img_src_value = /*selectedImage*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*imageEntries, selectImage*/ 65) {
    				each_value = /*imageEntries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(130:0) {#if selectedImage}",
    		ctx
    	});

    	return block;
    }

    // (144:12) {#each imageEntries as thumb}
    function create_each_block$1(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[12](/*thumb*/ ctx[15], ...args);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*thumb*/ ctx[15].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-vvff7p");
    			add_location(img, file$3, 144, 16, 4763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*imageEntries*/ 1 && img.src !== (img_src_value = /*thumb*/ ctx[15].thumb)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(144:12) {#each imageEntries as thumb}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*imageEntries*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block = /*selectedImage*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "gallery svelte-vvff7p");
    			add_location(div, file$3, 107, 0, 3608);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleKeyDown*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageEntries, openLightbox*/ 5) {
    				each_value_1 = /*imageEntries*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*selectedImage*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*selectedImage*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Test", slots, []);
    	let { imageEntries = [] } = $$props; // Array of objects: { thumb, full, date }
    	let selectedImage = null;
    	let startX = 0; // For swipe gestures

    	// Open lightbox with the full-size image.
    	function openLightbox(fullImage) {
    		$$invalidate(1, selectedImage = fullImage);
    	}

    	// Close lightbox only if clicking on the background.
    	function closeLightbox(event) {
    		if (event.target.classList.contains("lightbox")) {
    			$$invalidate(1, selectedImage = null);
    		}
    	}

    	// Go to next image. If called from a keyboard event, event may be undefined.
    	function nextImage(event) {
    		if (event) event.stopPropagation();
    		let index = imageEntries.findIndex(img => img.full === selectedImage);

    		if (index < imageEntries.length - 1) {
    			$$invalidate(1, selectedImage = imageEntries[index + 1].full);
    		}
    	}

    	// Go to previous image.
    	function prevImage(event) {
    		if (event) event.stopPropagation();
    		let index = imageEntries.findIndex(img => img.full === selectedImage);

    		if (index > 0) {
    			$$invalidate(1, selectedImage = imageEntries[index - 1].full);
    		}
    	}

    	// Select a specific image (from thumbnail navigation).
    	function selectImage(event, fullImage) {
    		event.stopPropagation();
    		$$invalidate(1, selectedImage = fullImage);
    	}

    	// For swipe gestures.
    	function handleTouchStart(event) {
    		startX = event.touches[0].clientX;
    	}

    	function handleTouchEnd(event) {
    		let endX = event.changedTouches[0].clientX;

    		if (startX - endX > 50) {
    			nextImage(event);
    		} else if (endX - startX > 50) {
    			prevImage(event);
    		}
    	}

    	// Handle arrow keys and Esc key.
    	function handleKeyDown(event) {
    		if (!selectedImage) return; // Only act if lightbox is open.

    		if (event.key === "ArrowRight") {
    			nextImage();
    		} else if (event.key === "ArrowLeft") {
    			prevImage();
    		} else if (event.key === "Escape") {
    			$$invalidate(1, selectedImage = null);
    		}
    	}

    	// Fetch images from the server.
    	async function fetchImages() {
    		try {
    			const response = await fetch("https://karmukil.tunnelagent.com/AiKart/");
    			const html = await response.text();
    			const imageEntriesData = [];
    			const regex = /<a href="([^"]+\.(jpg|png|gif|jpeg|webp))">.*?<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})/gi;
    			let match;

    			while ((match = regex.exec(html)) !== null) {
    				const fileName = match[1];
    				const fileDate = match[3];
    				const dateObj = new Date(fileDate.replace(/-/g, " "));

    				imageEntriesData.push({
    					thumb: `https://karmukil.tunnelagent.com/AiKart/th/${fileName}`,
    					full: `https://karmukil.tunnelagent.com/AiKart/${fileName}`,
    					date: dateObj
    				});
    			}

    			// Sort images by date (newest first).
    			imageEntriesData.sort((a, b) => b.date - a.date);

    			$$invalidate(0, imageEntries = [...imageEntriesData]); // Update the reactive variable.
    		} catch(error) {
    			console.error("Error fetching images:", error);
    		}
    	}

    	fetchImages();
    	const writable_props = ["imageEntries"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Test> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler_1 = image => openLightbox(image.full);
    	const click_handler_2 = (thumb, event) => selectImage(event, thumb.full);

    	$$self.$$set = $$props => {
    		if ("imageEntries" in $$props) $$invalidate(0, imageEntries = $$props.imageEntries);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		imageEntries,
    		selectedImage,
    		startX,
    		openLightbox,
    		closeLightbox,
    		nextImage,
    		prevImage,
    		selectImage,
    		handleTouchStart,
    		handleTouchEnd,
    		handleKeyDown,
    		fetchImages
    	});

    	$$self.$inject_state = $$props => {
    		if ("imageEntries" in $$props) $$invalidate(0, imageEntries = $$props.imageEntries);
    		if ("selectedImage" in $$props) $$invalidate(1, selectedImage = $$props.selectedImage);
    		if ("startX" in $$props) startX = $$props.startX;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		imageEntries,
    		selectedImage,
    		openLightbox,
    		closeLightbox,
    		nextImage,
    		prevImage,
    		selectImage,
    		handleTouchStart,
    		handleTouchEnd,
    		handleKeyDown,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Test extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { imageEntries: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Test",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get imageEntries() {
    		throw new Error("<Test>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageEntries(value) {
    		throw new Error("<Test>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* App.svelte generated by Svelte v3.29.4 */
    const file$4 = "App.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let introcard;
    	let t0;
    	let searchbox;
    	let t1;
    	let gallery;
    	let current;
    	introcard = new IntroCard({ $$inline: true });
    	searchbox = new SearchBox({ $$inline: true });
    	gallery = new Gallery({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(introcard.$$.fragment);
    			t0 = space();
    			create_component(searchbox.$$.fragment);
    			t1 = space();
    			create_component(gallery.$$.fragment);
    			add_location(div, file$4, 7, 0, 198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(introcard, div, null);
    			append_dev(div, t0);
    			mount_component(searchbox, div, null);
    			append_dev(div, t1);
    			mount_component(gallery, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(introcard.$$.fragment, local);
    			transition_in(searchbox.$$.fragment, local);
    			transition_in(gallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(introcard.$$.fragment, local);
    			transition_out(searchbox.$$.fragment, local);
    			transition_out(gallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(introcard);
    			destroy_component(searchbox);
    			destroy_component(gallery);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ IntroCard, Gallery, SearchBox, Test });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    new App({ target: document.body });

}());
