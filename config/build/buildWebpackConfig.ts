import webpack from 'webpack';
import { BuildProps } from './types/config';
import { buildLoaders } from './buildLoaders';
import { buildResolve } from './buildResolve';
import { buildPlugins } from './buildPlugins';
import { buildDevServer } from './buildDevServer';
import { developAPI, prodAPI } from './const/apiURL';

export const buildWebpackConfig = (options: BuildProps): webpack.Configuration => {
    const {
        paths,
        mode,
        isDev,
        port
    } = options;
    const API_URL = mode === 'production'
        ? prodAPI
        : developAPI;

    return {
        entry: paths.entry,
        mode: mode,
        module: {
            rules: buildLoaders(options),
        },
        resolve: buildResolve(paths),
        output: {
            filename: 'js/[name].[contenthash].js',
            path: paths.build,
            clean: true,
            assetModuleFilename: 'assets/fonts/[name][ext][query]'
        },
        plugins: buildPlugins(paths, API_URL, isDev),
        devtool: isDev ? 'eval-cheap-module-source-map' : undefined,
        devServer: isDev ? buildDevServer(options) : undefined,
    }
}