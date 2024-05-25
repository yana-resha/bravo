import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { BuildProps } from './types/config';
export const buildLoaders = (options: BuildProps): webpack.RuleSetRule[] => {
    const svgLoader = {
        test: /\.svg$/,
        use: [{
            loader: '@svgr/webpack',
            options: {
                icon: true,
                svgoConfig: {
                    plugins: [
                        {
                            name: 'convertColors',
                            params: {
                                currentColor: true,
                            },
                        },
                    ],
                },
            },
        }],
    };
    const typescriptLoader = {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    }
    const cssLoader = {
         test: /\.(sass|css|scss)$/,
        use: [
            options.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (resPath: string) => resPath.includes('.module.'),
                        localIdentName: options.isDev
                            ? '[path][name]__[local]--[hash:base64:5]'
                            : '[hash:base64:8]',
                    },
                },
            },
            {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: ["autoprefixer"],
                  },
                },
            },
            "sass-loader"
        ],
    }
    const imageLoader = {
        test: /\.(png|jpe?g|gif)$/,
        exclude: /node_modules/,
        type: "javascript/auto",
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/img/',
                    esModule: false
                }
                
            },
        ],

    };

    const fontLoader = {
        test: /\.(woff2|woff|ttf|eot)$/,
        exclude: /node_modules/,
        type: "asset/resource",
        // type: "javascript/auto",
        // use: [

        //     {
        //         loader: "file-loader?name=assets/fonts/[name]-[hash].[ext]",
        //         // loader: 'file-loader',
        //         // options: {
        //         //     name: '[name].[ext]',
        //         //     outputPath: 'assets/fonts/',
        //         // }
                
        //     },
        // ],

    }


    return [
        fontLoader,
        imageLoader,
        svgLoader,
        typescriptLoader,
        cssLoader,
    ]
}