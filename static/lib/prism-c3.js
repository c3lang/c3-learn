// This *must* be loaded after prismjs is
"use strict";

Prism.languages['c3'] = {
	'comment-line': {
		pattern: /\/\/.*/,
		greedy: true,
		alias: 'comment',
	},
	// Only a single level of nesting, from https://github.com/PrismJS/prism/blob/ded4a65b75a246b4dbc6c5a84e584db1078529aa/src/languages/odin.js#L18
	'comment-block': {
		pattern: /\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:\*(?!\/)|[^*])*(?:\*\/|$))*(?:\*\/|$)/,
		greedy: true,
		alias: 'comment',
	},
	'comment-doc': {
		pattern: /<\*(?!>)[\s\S]*?(\*>|$)/,
		greedy: true,
		alias: 'comment',
	},
	'string': {
		pattern: /".*?(?!\\)"/,
		greedy: true,
	},
	'literal-string': {
		pattern: /`.*?(?!\\)`/,
		greedy: true,
		alias: 'string',
	},
	'char': {
		pattern: /'.*?(?!\\)'/,
		greedy: true,
		alias: 'string',
	},
	'shebang': {
		pattern: /^#!.*/,
		greedy: true,
		alias: 'comment',
	},

	'keyword': {
		pattern: /(?<![@#$])\b(?:alias|assert|asm|attrdef|bitstruct|break|case|catch|constdef|const|continue|default|defer|do|else|enum|extern|false|faultdef|for|foreach|foreach_r|fn|tlocal|if|inline|import|lengthof|macro|module|nextcase|null|interface|return|static|struct|switch|true|try|typedef|union|var|while)\b/,
		alias: 'important',
	},
	'comptime-keyword': {
		pattern: /(?<!\w)[$](?:assert|case|default|defined|echo|else|embed|endfor|endforeach|endif|endswitch|eval|error|exec|expand|feature|for|foreach|if|include|reflect|stringify|switch|Typefrom|Typeof|vaarg)\b/,
		alias: 'function',
	},
	'builtin-keyword': {
		pattern: /(?<!\w)[$]{2}(?:abs|any_make|atomic_load|atomic_store|atomic_fetch_exchange|atomic_fetch_add|atomic_fetch_sub|atomic_fetch_and|atomic_fetch_nand|atomic_fetch_or|atomic_fetch_xor|atomic_fetch_max|atomic_fetch_min|atomic_fetch_inc_wrap|atomic_fetch_dec_wrap|bitreverse|breakpoint|bswap|ceil|compare_exchange|copysign|cos|clz|ctz|add|div|mod|mul|neg|sub|exp|exp2|expect|expect_with_probability|fence|floor|fma|fmuladd|frameaddress|fshl|fshr|gather|get_rounding_mode|int_to_mask|log|log10|log2|matrix_mul|matrix_transpose|mask_to_int|masked_load|masked_store|max|memcpy|memcpy_inline|memmove|memset|memset_inline|min|nearbyint|overflow_add|overflow_mul|overflow_sub|popcount|pow|pow_int|prefetch|reduce_add|reduce_and|reduce_fadd|reduce_fmul|reduce_max|reduce_min|reduce_mul|reduce_or|reduce_xor|reverse|returnaddress|rint|rnd|round|roundeven|sat_add|sat_shl|sat_sub|sat_mul|scatter|select|set_rounding_mode|sprintf|str_find|str_hash|str_lower|str_pascalcase|str_replace|str_upper|str_snakecase|swizzle|swizzle2|sin|sqrt|syscall|sysclock|trap|trunc|unaligned_load|unaligned_store|unreachable|veccomplt|veccomple|veccompgt|veccompge|veccompeq|veccompne|volatile_load|volatile_store|wasm_memory_size|wasm_memory_grow|wstr16|wstr32|DATE|FILE|FILEPATH|FUNC|FUNCTION|LINE|LINE_RAW|MODULE|BENCHMARK_NAMES|BENCHMARK_FNS|TEST_NAMES|TEST_FNS|TIME|BUILD_HASH|BUILD_DATE|OS_TYPE|ARCH_TYPE|MAX_VECTOR_SIZE|REGISTER_SIZE|COMPILER_LIBC_AVAILABLE|CUSTOM_LIBC|COMPILER_OPT_LEVEL|PLATFORM_BIG_ENDIAN|PLATFORM_I128_SUPPORTED|PLATFORM_F16_SUPPORTED|PLATFORM_F128_SUPPORTED|REGISTER_SIZE|COMPILER_SAFE_MODE|DEBUG_SYMBOLS|BACKTRACE|LLVM_VERSION|BENCHMARKING|TESTING|PANIC_MSG|MEMORY_ENVIRONMENT|ADDRESS_SANITIZER|MEMORY_SANITIZER|THREAD_SANITIZER|LANGUAGE_DEV_VERSION|AUTHORS|AUTHOR_EMAILS|PROJECT_VERSION|VERSION|PRERELEASE)\b/,
		alias: 'number',
	},
	'attribute': {
		pattern: /(?<!\w)[@](?:align|allow_deprecated|benchmark|bigendian|builtin|callconv|cname|compact|const|constinit|deprecated|dynamic|export|finalizer|format|if|inline|init|jump|link|littleendian|local|maydiscard|mustinit|naked|noalias|nodiscard|noinit|noinline|nopadding|norecurse|noreturn|nosanitize|nostrip|obfuscate|operator|operator_r|operator_s|optional|overlap|packed|private|public|pure|reflect|safeinfer|safemacro|simd|section|tag|test|unused|used|wasm|weak|weaklink|winmain)\b/,
		alias: 'important',
	},
	'builtin-type': {
		pattern: /\b(?:void|bool|char|double|float|float16|bfloat|int128|ichar|int|iptr|isz|long|short|uint128|uint|ulong|uptr|ushort|usz|float128|any|fault|typeid|sz)\b/,
		alias: 'builtin',
	},

	'module-decl': {
		pattern: /\s*(module|import)\s+[a-z0-9_]+(?:::[a-z0-9_]+)*(?:(?:,\s*[a-z0-9_]+(?:::[a-z0-9_]+)*)+)?/,
		greedy: true,
		alias: 'variable',
		inside: {
			'keyword': {
				pattern: /\b(?:module|import)\b/,
				alias: 'important',
			},
			'keyword': {
				pattern: /(?<![@#$])\b(?:alias|assert|asm|attrdef|bitstruct|break|case|catch|constdef|const|continue|default|defer|do|else|enum|extern|false|faultdef|for|foreach|foreach_r|fn|tlocal|if|inline|import|lengthof|macro|module|nextcase|null|interface|return|static|struct|switch|true|try|typedef|union|var|while)\b/,
				alias: 'important',
			},
			'builtin-type': {
				pattern: /\b(?:void|bool|char|double|float|float16|bfloat|int128|ichar|int|iptr|isz|long|short|uint128|uint|ulong|uptr|ushort|usz|float128|any|fault|typeid|sz)\b/,
				alias: 'builtin',
			},
			'operator': {
				pattern: /::|,/,
				alias: 'important',
			},
			'module-path': {
				pattern: /\b[a-z0-9_]+(?=::)/,
				alias: 'variable',
			},
		}
	},
	'constant': {
		pattern: /\$?\b_*[A-Z][A-Z_0-9]*\b/,
		alias: 'builtin',
	},
	'user-type': {
		pattern: /\$?\b_*[A-Z][A-Z_0-9]*[a-z][A-Z_0-9a-z]*\b/,
		alias: 'builtin',
	},
	'user-attr': {
		pattern: /@\b[A-Z][A-Z_0-9]*[a-z][A-Z_0-9a-z]*\b/,
		alias: 'important',
	},
	'function': /(?:[@#$])?\b_*[a-z][a-zA-Z0-9_]*\s*(?=\()/,
	'number': /\b[+-]?(?:0(?:[xX][0-9a-fA-F](?:_*[0-9a-fA-F])*|[oO][0-7](?:_*[0-7])*|[bB][10](?:_*[10])*)|[0-9](?:_*[0-9])*(?:_*[eE][+-]?[0-9]+)?)(?:[iIuU](?:8|16|32|64|128)?|[fF](?:32|64)?|[uU][lL])?\b/,
	'operator': {
		pattern: /<<=|>>=|&&&|\|\|\||\+\+\+|::|->|\+\+|--|&&|\|\||\?\?|\?:|<<|>>|<=|>=|==|!=|[+\-*/%&|^]?=|[.=\-+/*!<>&|^~%?:]/,
		alias: 'important',
	},
	'punctuation': /[{}[\];(),]/,
	'variable': /\b[a-z_][a-zA-Z0-9_]*\b/,
};
