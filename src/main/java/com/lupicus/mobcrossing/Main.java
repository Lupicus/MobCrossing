package com.lupicus.mobcrossing;

import net.minecraftforge.fml.IExtensionPoint.DisplayTest;
import net.minecraftforge.fml.ModLoadingContext;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fmllegacy.network.FMLNetworkConstants;

@Mod(Main.MODID)
public class Main
{
	public static final String MODID = "mobcrossing";

	public Main()
	{
		ModLoadingContext.get().registerExtensionPoint(DisplayTest.class,
				() -> new DisplayTest(() -> FMLNetworkConstants.IGNORESERVERONLY, (a, b) -> true));
	}
}
