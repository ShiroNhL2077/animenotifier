package shop

import (
	"net/http"

	"github.com/animenotifier/arn"

	"github.com/aerogo/aero"
	"github.com/animenotifier/notify.moe/components"
	"github.com/animenotifier/notify.moe/utils"
)

// Get shop page.
func Get(ctx *aero.Context) string {
	user := utils.GetUser(ctx)

	if user == nil {
		return ctx.Error(http.StatusUnauthorized, "Not logged in", nil)
	}

	items := arn.AllItems()

	return ctx.HTML(components.Shop(user, items))
}